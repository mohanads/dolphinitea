import { h } from 'preact';
import render from 'preact-render-to-string';
import { Elysia } from 'elysia';
import CacheClient from '../../clients/cache';
import DiscordClient from '../../clients/discord';
import SupabaseClient from '../../clients/supabase';
import HtmlTemplate from '../../components/HtmlTemplate';
import App from '../../components/App';
import * as Errors from '../../errors';
import type { ISession } from '../../state';

const exposedEnvVars: Record<string, string | number | boolean> = [
    'DISCORD_AUTH_LINK',
    'DISCORD_INVITE_LINK',
    'GITHUB_LINK',
].reduce((env, envVar) => {
    env[envVar] = process.env[envVar];
    return env;
}, {});

export default () => new Elysia()
    .use((app) => {
        return app.derive({ as: 'local' }, async (context): Promise<{ session: ISession }> => {
            const { sessionToken } = context.cookie;

            if (!sessionToken.value) {
                console.log('New user w/o session token');
                const session = { sessionToken: Bun.randomUUIDv7() };
                sessionToken.set({ value: session.sessionToken });
                console.log('Generated session token for new user');
                await CacheClient.set(session.sessionToken, session);
                console.log('Successfully cached session token');
                return { session };
            }

            console.log('Existing user w/ session token');
            let session = await CacheClient.get<ISession>(sessionToken.value);
            if (!session) {
                console.warn('Received a Session Token, but session wasn not cached');
                session = { sessionToken: sessionToken.value };
                await CacheClient.set(sessionToken.value, session);
                console.log('Re-cached the session using the received session token');
            }
            console.log('Resolved session from cache');
            return { session };
        });
    })
    .get('/', async (context) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        const { sessionToken, user } = context.session;
        const state = { sessionToken, user };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    })
    .get('/oauth2', async (context) => {
        try {
            const auth = await DiscordClient.consumeAuthCode(context.query.code);
            console.log("Consumed user's auth code");

            const user = (await DiscordClient.getUser(auth.access_token)).user;
            context.session.user = user;
            context.session.discordAccessToken = auth.access_token;
            context.session.discordRefreshToken = auth.refresh_token;
            await CacheClient.set(context.session.sessionToken, context.session);
            console.log('Cached Discord user, access & refresh tokens into session');

            const { sessionToken } = context.session;
            const state = { sessionToken, user };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state}>
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    })
    .get('/guilds', async (context) => {
        try {
            const guilds = await DiscordClient.getGuilds(context.session.discordAccessToken);
            context.session.guilds = guilds;
            await CacheClient.set(context.session.sessionToken, context.session);
            console.log("Fetched user's guilds and cached them");

            const { sessionToken, user } = context.session;
            const state = { sessionToken, user, guilds };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state}>
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    })
    .get('/guilds/:id', async (context) => {
        const { id } = context.params;

        if (!context.session.guilds) {
            console.warn('User\'s Guilds are not loaded for Config page', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const guilds = await DiscordClient.getGuilds(context.session.discordAccessToken);
            context.session.guilds = guilds;
            await CacheClient.set(context.session.sessionToken, context.session);
            console.log("Fetched user's guilds and cached them for Config");
        }

        const isUserInGuild = context.session.guilds?.find((guild) => guild.id === id);
        if (!isUserInGuild) {
            console.warn('User tried accessing unauthorized guild', {
                userId: context.session.user?.id,
                guildId: id,
            });
            throw new Errors.LoadedError(Errors.Code.UNAUTHORIZED_CONFIG_ACCESS);
        }

        const guildConfig = await SupabaseClient.getGuildConfigs(id);
        const guild = context.session.guilds?.find((guild) => guild.id === id);

        const { sessionToken, user } = context.session;
        const state = { sessionToken, user, guild, guildConfig };
        context.set.headers = { 'Content-Type': 'text/html' };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    });
