import { h } from 'preact';
import render from 'preact-render-to-string';
import { Elysia } from 'elysia';
import CacheClient from '../../clients/cache';
import DiscordClient, { DiscordGuild } from '../../clients/discord';
import SupabaseClient from '../../clients/supabase';
import HtmlTemplate from '../../components/HtmlTemplate';
import App from '../../components/App';
import * as Errors from '../../errors';
import type { ISession } from '../../state';
import { logger } from '../../logger';

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
                logger.info('New user w/o session token');
                const session = { sessionToken: Bun.randomUUIDv7() };
                sessionToken.set({ value: session.sessionToken });
                logger.info('Generated session token for new user');
                await CacheClient.set(session.sessionToken, session);
                logger.info('Successfully cached session token');
                return { session };
            }

            logger.info('Existing user w/ session token');
            let session = await CacheClient.get<ISession>(sessionToken.value);
            if (!session) {
                logger.warn('Received a Session Token, but session wasn not cached');
                session = { sessionToken: sessionToken.value };
                await CacheClient.set(sessionToken.value, session);
                logger.info('Re-cached the session using the received session token');
            }
            logger.info('Resolved session from cache');
            return { session };
        });
    })
    .get('/', async (context) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        const { sessionToken, user, displayGuilds } = context.session;
        const state = { sessionToken, user, guilds: displayGuilds };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    })
    .get('/oauth2', async (context) => {
        try {
            const auth = await DiscordClient.consumeAuthCode(context.query.code);
            logger.info("Consumed user auth code");

            const user = await DiscordClient.getUser(auth.access_token);
            context.session.user = user;
            context.session.discordAccessToken = auth.access_token;
            context.session.discordRefreshToken = auth.refresh_token;
            await CacheClient.set(context.session.sessionToken, context.session);
            logger.info('Cached Discord user, access & refresh tokens into session');

            const { sessionToken, displayGuilds } = context.session;
            const state = { sessionToken, user, guilds: displayGuilds };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state}>
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        } catch (error) {
            logger.error(error);
            return error;
        }
    })
    .get('/guilds', async (context) => {
        try {
            let userGuilds = context.session.userGuilds;
            let botGuilds: DiscordGuild[] | undefined;
            let botGuildIds: Record<DiscordGuild['id'], boolean> | undefined = {};
            let displayGuilds: DiscordGuild[] = [];

            /**
             * Pull the user's Guilds. Either from API or from Cache.
             */
            if (!userGuilds) {
                // TODO: send error back to display
                if (!context.session.discordAccessToken) {
                    const { sessionToken, user } = context.session;
                    const state = { sessionToken, user };
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render(
                        <HtmlTemplate envVars={exposedEnvVars} state={state}>
                            <App url={context.request.url} state={state} />
                        </HtmlTemplate>
                    );
                }
                userGuilds = await DiscordClient.getUserGuilds(context.session.discordAccessToken);
                // TODO: send error back to display
                if (!userGuilds) {
                    const { sessionToken, user } = context.session;
                    const state = { sessionToken, user };
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render(
                        <HtmlTemplate envVars={exposedEnvVars} state={state}>
                            <App url={context.request.url} state={state} />
                        </HtmlTemplate>
                    );
                }
                context.session.userGuilds = userGuilds;
                await CacheClient.set(context.session.sessionToken, context.session);
                logger.info("Fetched user guilds and cached them");
            }

            /**
             * Pull the Bot's Guilds. Either from API or from Cache.
             */
            botGuildIds = await CacheClient.get(':BOT_GUILDS_IDS');
            if (!botGuildIds) {
                botGuildIds = {};
                botGuilds = await DiscordClient.getBotGuilds();
                // TODO: send error back to display
                if (!botGuilds) {
                    const { sessionToken, user } = context.session;
                    const state = { sessionToken, user };
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render(
                        <HtmlTemplate envVars={exposedEnvVars} state={state}>
                            <App url={context.request.url} state={state} />
                        </HtmlTemplate>
                    );
                }
                botGuilds.forEach((botGuild) => botGuildIds![botGuild.id] = true);
                await CacheClient.set(":BOT_GUILDS_IDS", botGuildIds);
                logger.info("Fetched bot guilds IDs and cached them");
            }

            /**
             * Union user's Guilds + Bot's Guilds for display.
             */
            displayGuilds = userGuilds.filter((userGuild) => botGuildIds[userGuild.id])
            context.session.displayGuilds = displayGuilds;
            await CacheClient.set(context.session.sessionToken, context.session);
            logger.info('Cached user display Guilds');

            const { sessionToken, user } = context.session;
            const state = { sessionToken, user, guilds: displayGuilds };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state}>
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        } catch (error) {
            logger.error(error);
            return error;
        }
    })
    .get('/guilds/:id', async (context) => {
        const { id } = context.params;

        if (!context.session.userGuilds) {
            logger.warn('User Guilds are not loaded for Config page', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const userGuilds = await DiscordClient.getUserGuilds(context.session.discordAccessToken!);
            context.session.userGuilds = userGuilds;
            await CacheClient.set(context.session.sessionToken, context.session);
            logger.info("Fetched user guilds and cached them for Config");
        }

        const isUserInGuild = context.session.userGuilds?.find((guild) => guild.id === id);
        if (!isUserInGuild) {
            logger.warn('User tried accessing unauthorized guild', {
                userId: context.session.user?.id,
                guildId: id,
            });
            throw new Errors.LoadedError(Errors.Code.UNAUTHORIZED_CONFIG_ACCESS);
        }

        const guildConfig = await SupabaseClient.getGuildConfigs(id);
        const userGuild = context.session.userGuilds?.find((guild) => guild.id === id);

        const { sessionToken, user, displayGuilds } = context.session;
        const state = { sessionToken, user, guilds: displayGuilds, guild: userGuild, guildConfig };
        context.set.headers = { 'Content-Type': 'text/html' };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    });
