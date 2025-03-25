import { h } from 'preact';
import render from 'preact-render-to-string';
import { Elysia, t } from 'elysia';
import CacheClient from '../../clients/cache';
import DiscordClient, { DiscordGuild } from '../../clients/discord';
import SupabaseClient from '../../clients/supabase';
import LaunchDarklyClient from '../../clients/launchDarkly';
import HtmlTemplate from '../../components/HtmlTemplate';
import App from '../../components/App';
import { logger } from '../../logger';
import * as Errors from '../../errors';
import type { ISession } from '../../state';

// TODO: add guards for auth check and guild perm check

const exposedEnvVars: Record<string, string | number | boolean> = [
    'DISCORD_AUTH_LINK',
    'DISCORD_INVITE_LINK',
    'GITHUB_LINK',
].reduce((env, envVar) => {
    env[envVar] = process.env[envVar];
    return env;
}, {});

const schemas = {
    featureFlags: t.Object({
        create_vc: t.Optional(t.Boolean()),
        giveaway: t.Optional(t.Boolean()),
        in_voice_count: t.Optional(t.Boolean()),
        member_count: t.Optional(t.Boolean()),
        navigate: t.Optional(t.Boolean()),
        purge: t.Optional(t.Boolean()),
        register_poe2: t.Optional(t.Boolean()),
        reload: t.Optional(t.Boolean()),
        reputation_tracking: t.Optional(t.Boolean()),
        starboard: t.Optional(t.Boolean()),
        status: t.Optional(t.Boolean()),
        temp_message: t.Optional(t.Boolean()),
        text_xp: t.Optional(t.Boolean()),
        voice_xp: t.Optional(t.Boolean()),
        created_at: t.Optional(t.String())
    })
};

export default () => new Elysia()
    .use((app) => {
        return app.derive({ as: 'local' }, async (context): Promise<{ session: ISession }> => {
            const { sessionToken } = context.cookie;

            if (!sessionToken.value) {
                logger.info('New user w/o session token');
                const session = { sessionToken: Bun.randomUUIDv7() };
                sessionToken.set({ value: session.sessionToken });
                logger.info('Generated session token for new user');
                await CacheClient.set(`SESSION:${session.sessionToken}`, session);
                logger.info('Successfully cached session token');
                return { session };
            }

            logger.info('Existing user w/ session token');
            let session = await CacheClient.get<ISession>(`SESSION:${sessionToken.value}`);
            if (!session) {
                logger.warn('Received a Session Token, but session wasn not cached');
                session = { sessionToken: sessionToken.value };
                await CacheClient.set(`SESSION:${sessionToken.value}`, session);
                logger.info('Re-cached the session using the received session token');
            }
            logger.info('Resolved session from cache');
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
    .get('/privacy', async (context) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        const { sessionToken, user } = context.session;
        const state = { sessionToken, user };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    })
    .get('/terms', async (context) => {
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
            logger.info("Consuming auth code");
            const auth = await DiscordClient.consumeAuthCode(context.query.code);
            logger.info("Consumed user auth code");

            const user = await DiscordClient.getUser(auth.access_token);
            context.session.user = user;
            context.session.discordAccessToken = auth.access_token;
            context.session.discordRefreshToken = auth.refresh_token;
            await CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
            logger.info('Cached Discord user, access & refresh tokens into session');

            const { sessionToken } = context.session;
            const state = { sessionToken, user };
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
            let userGuilds: DiscordGuild[] | undefined;
            let botGuilds: DiscordGuild[] | undefined;
            let botGuildIds: Record<DiscordGuild['id'], boolean> | undefined = {};
            let displayGuilds: DiscordGuild[] = [];

            /**
             * Get the user Guilds.
             */
            if (context.session.discordAccessToken) {
                logger.info('Session has Discord access token. Attempting to fetch fresh user Guilds');
                userGuilds = await DiscordClient.getUserGuilds(context.session.discordAccessToken);

                if (userGuilds) {
                    logger.info('Fetched fresh user Guilds');
                    context.session.userGuilds = userGuilds;
                    await CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
                    logger.info('Cached fresh user Guilds');
                } else {
                    logger.info('No fresh Guilds were returned from Discord');
                    if (context.session.userGuilds) {
                        logger.info('Cache has user Guilds. Using them');
                        userGuilds = context.session.userGuilds;
                    } else {
                        logger.warn('Guilds are not cached and could not be fetched from Discord', {
                            accessToken: context.session.discordAccessToken,
                            userId: context.session.user?.id,
                            userUsername: context.session.user?.username,
                            userGlobalName: context.session.user?.global_name,
                        });
                    }
                }
            } else {
                if (context.session.userGuilds) {
                    logger.info('Using already cached user Guilds');
                    userGuilds = context.session.userGuilds;
                } else {
                    /**
                     * The user's Guilds aren't cached and we are unable to pull them.
                     */
                    logger.warn('User Guilds are not cached and no Discord access token present', {
                        userId: context.session.user?.id,
                        userUsername: context.session.user?.username,
                        userGlobalName: context.session.user?.global_name,
                    });
                    const { sessionToken, user } = context.session;
                    const state = { sessionToken, user };
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render(
                        <HtmlTemplate envVars={exposedEnvVars} state={state}>
                            <App url={context.request.url} state={state} />
                        </HtmlTemplate>
                    );
                }
            }

            /**
             * Get the Bot Guilds.
             */
            logger.info('Attempting to fetch fresh bot Guilds');
            botGuilds = await DiscordClient.getBotGuilds();
            if (botGuilds) {
                logger.info('Fetched fresh bot Guilds');
                botGuildIds = {};
                botGuilds.forEach((botGuild) => botGuildIds![botGuild.id] = true);
                await CacheClient.set(`BOT_GUILD_IDS:${process.env.DISCORD_CLIENT_ID}`, botGuildIds, 5 * 60 * 60);
            } else {
                logger.info('Fresh bot Guilds were not returned from Discord');
                botGuildIds = await CacheClient.get(`BOT_GUILD_IDS:${process.env.DISCORD_CLIENT_ID}`);
                if (botGuildIds) {
                    logger.info('Bot Guild IDs were cached. Using them');
                } else {
                    logger.warn('Bot Guilds could not be fetched and their IDs are not cached', {
                        userId: context.session.user?.id,
                        userUsername: context.session.user?.username,
                        userGlobalName: context.session.user?.global_name,
                    });
                    const { sessionToken, user } = context.session;
                    const state = { sessionToken, user };
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render(
                        <HtmlTemplate envVars={exposedEnvVars} state={state}>
                            <App url={context.request.url} state={state} />
                        </HtmlTemplate>
                    );
                }
            }

            /**
             * Union user's Guilds + Bot's Guilds for display.
             */
            displayGuilds = userGuilds!.filter((userGuild) => {
                return (
                    botGuildIds[userGuild.id] &&
                    (BigInt(userGuild.permissions) & BigInt(1 << 3)) === BigInt(1 << 3)
                );
            });
            logger.info('Calculated user display Guilds');

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
            await CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
            logger.info("Fetched user guilds and cached them for Config");
        }

        const userGuild = context.session.userGuilds?.find((guild) => guild.id === id);
        const isUserInGuild = !!userGuild;
        if (!isUserInGuild) {
            logger.warn('User tried accessing unauthorized guild', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const { sessionToken, user } = context.session;
            const state = { sessionToken, user };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state}>
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        }

        const isUserAuthorized = (BigInt(userGuild!.permissions) & BigInt(1 << 3)) === BigInt(1 << 3);
        if (!isUserAuthorized) {
            logger.warn('User tried updating Config of a guild without sufficient permissions', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const { sessionToken, user } = context.session;
            const state = { sessionToken, user };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state} >
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        }

        const { sessionToken, user } = context.session;
        const guildConfig = await SupabaseClient.getGuildConfigs(id);
        const botGuildIds = await CacheClient.get(`BOT_GUILD_IDS:${process.env.DISCORD_CLIENT_ID}`) as Record<DiscordGuild['id'], boolean>;
        const displayGuilds = context.session.userGuilds!.filter((userGuild) => botGuildIds[userGuild.id]);
        const featureFlags = await LaunchDarklyClient.getAllFlags({ userId: user!.id, userName: user!.username, userEmail: user!.email });
        const state = { sessionToken, user, guilds: displayGuilds, guild: userGuild, guildConfig, featureFlags };
        context.set.headers = { 'Content-Type': 'text/html' };
        return render(
            <HtmlTemplate envVars={exposedEnvVars} state={state}>
                <App url={context.request.url} state={state} />
            </HtmlTemplate>
        );
    })
    // TODO: move to new guild.ts file
    .put('/guilds/:id/config', async (context) => {
        const { id } = context.params;

        // TODO: validate via JSONSchema
        if (!('featureFlags' in context.body)) throw new Errors.LoadedError(Errors.Code.INVALID_CONFIG_UPDATE);

        if (!context.session.userGuilds) {
            logger.warn('User Guilds are not loaded for updating Config', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const userGuilds = await DiscordClient.getUserGuilds(context.session.discordAccessToken!);
            context.session.userGuilds = userGuilds;
            await CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
            logger.info("Fetched user guilds and cached them for Config update");
        }

        const userGuild = context.session.userGuilds?.find((guild) => guild.id === id);
        const isUserInGuild = !!userGuild;
        if (!isUserInGuild) {
            logger.warn('User tried updating unauthorized Guild for Config update', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const { sessionToken, user } = context.session;
            const state = { sessionToken, user };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state} >
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        }

        const isUserAuthorized = (BigInt(userGuild.permissions) & BigInt(1 << 3)) === BigInt(1 << 3);
        if (!isUserAuthorized) {
            logger.warn('User tried updating Config of a guild without sufficient permissions', {
                userId: context.session.user?.id,
                guildId: id,
            });
            const { sessionToken, user } = context.session;
            const state = { sessionToken, user };
            context.set.headers = { 'Content-Type': 'text/html' };
            return render(
                <HtmlTemplate envVars={exposedEnvVars} state={state} >
                    <App url={context.request.url} state={state} />
                </HtmlTemplate>
            );
        }

        try {
            await SupabaseClient.updateFeatureFlags(id, context.body.featureFlags);
        } catch (error) {
            // TODO: error handling
        }
    }, {
        body: t.Object({
            featureFlags: schemas.featureFlags,
        })
    });
