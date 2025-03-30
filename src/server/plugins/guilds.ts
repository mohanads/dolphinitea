import { Context, Elysia, t } from 'elysia';
import { logger } from '../../logger';
import CacheClient from '../../clients/cache';
import DiscordClient, { DiscordGuild } from '../../clients/discord';
import render from '../render';
import SupabaseClient from '../../clients/supabase';
import * as Errors from '../../errors';
import { FeatureFlag } from '../../clients/launchDarkly';
import { ISession } from '../../state';

const schemas = {
    featureFlags: t.Object({
        create_vc: t.Optional(t.Boolean()),
        giveaway: t.Optional(t.Boolean()),
        in_voice_count: t.Optional(t.Boolean()),
        member_count: t.Optional(t.Boolean()),
        purge: t.Optional(t.Boolean()),
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
    .guard({
        async beforeHandle(context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) {
            // return guild selection page
            let userGuilds: DiscordGuild[] | undefined;
            let botGuilds: DiscordGuild[] | undefined;
            let botGuildIds: Record<DiscordGuild['id'], boolean> | undefined = {};
            let displayGuilds: DiscordGuild[] = [];
            let getBotGuilds = DiscordClient.getBotGuilds();
            let getBotGuildIds = CacheClient.get<Record<DiscordGuild['id'], boolean>>(`BOT_GUILD_IDS:${process.env.DISCORD_CLIENT_ID}`);
            let getUserGuilds;

            if (context.session.discordAccessToken) {
                getUserGuilds = DiscordClient.getUserGuilds(context.session.discordAccessToken);
            }

            /**
             * Get the user Guilds.
             */
            if (context.session.discordAccessToken) {
                logger.info('Session has Discord access token. Attempting to fetch fresh user Guilds');
                userGuilds = await getUserGuilds;

                if (userGuilds) {
                    logger.info('Fetched fresh user Guilds');
                    context.session.userGuilds = userGuilds;
                    CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
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
                        context.set.headers = { 'Content-Type': 'text/html' };
                        return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
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
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                }
            }

            /**
             * Get the Bot Guilds.
             */
            logger.info('Fetching fresh bot Guilds');
            botGuilds = await getBotGuilds;
            if (botGuilds) {
                logger.info('Fetched fresh bot Guilds');
                botGuildIds = {};
                botGuilds.forEach((botGuild) => botGuildIds![botGuild.id] = true);
                CacheClient.set(`BOT_GUILD_IDS:${process.env.DISCORD_CLIENT_ID}`, botGuildIds, 5 * 60 * 60);
                logger.info('Cached bot Guild IDs');
            } else {
                logger.info('Fresh bot Guilds were not returned from Discord');
                botGuildIds = await getBotGuildIds;
                if (botGuildIds) {
                    logger.info('Bot Guild IDs were cached. Using them');
                } else {
                    logger.warn('Bot Guilds could not be fetched and their IDs are not cached', {
                        userId: context.session.user?.id,
                        userUsername: context.session.user?.username,
                        userGlobalName: context.session.user?.global_name,
                    });
                    context.set.headers = { 'Content-Type': 'text/html' };
                    return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                }
            }

            /**
             * Union user's Guilds + Bot's Guilds for display.
             */
            displayGuilds = userGuilds!.filter((userGuild) => (
                botGuildIds[userGuild.id] &&
                (BigInt(userGuild.permissions) & BigInt(1 << 3)) === BigInt(1 << 3)
            ));
            logger.info('Calculated user display Guilds');
            context.session.displayGuilds = displayGuilds;
            CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
            logger.info('Cached user display Guilds');
        }
    })
    .group('/guilds', (app) => {
        // ensure user authenticated
        // ensure bot guilds are loaded
        // ensure user guilds are loaded
        // calculate user display guilds
        return app
            .get('/', async (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
                context.set.headers = { 'Content-Type': 'text/html' };
                return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
            })
            .group('/:id', (app) => {
                // ensure guild has bot
                // ensure user is in this guild
                // ensure user has the necessary role in this guild (admin)
                return app
                    .guard({
                        async beforeHandle(context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) {
                            const { id } = context.params;
                            const userGuild = context.session.userGuilds!.find((guild) => guild.id === id);
                            const isUserInGuild = !!userGuild;
                            if (!isUserInGuild) {
                                logger.warn('User tried accessing unauthorized guild', {
                                    userId: context.session.user?.id,
                                    guildId: id,
                                });
                                context.set.headers = { 'Content-Type': 'text/html' };
                                return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                            }

                            const isUserAuthorized = (BigInt(userGuild!.permissions) & BigInt(1 << 3)) === BigInt(1 << 3);
                            if (!isUserAuthorized) {
                                logger.warn('User tried updating Config of a guild without sufficient permissions', {
                                    userId: context.session.user?.id,
                                    guildId: id,
                                });
                                context.set.headers = { 'Content-Type': 'text/html' };
                                return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                            }
                        }
                    })
                    .get('/', async (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
                        // return guild config page
                        const { id } = context.params;
                        const guildConfig = SupabaseClient.getGuildConfigs(id);
                        const userGuild = context.session.userGuilds!.find((guild) => guild.id === id);
                        context.set.headers = { 'Content-Type': 'text/html' };
                        return render({ ...context.session, guild: userGuild, guildConfig: await guildConfig, featureFlags: context.featureFlags }, context.request.url);
                    })
                    .put('/config', async (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
                        // put config in db
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
                            context.set.headers = { 'Content-Type': 'text/html' };
                            return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                        }

                        const isUserAuthorized = (BigInt(userGuild.permissions) & BigInt(1 << 3)) === BigInt(1 << 3);
                        if (!isUserAuthorized) {
                            logger.warn('User tried updating Config of a guild without sufficient permissions', {
                                userId: context.session.user?.id,
                                guildId: id,
                            });
                            context.set.headers = { 'Content-Type': 'text/html' };
                            return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
                        }

                        await SupabaseClient.putFeatureFlags(id, context.body.featureFlags);
                    }, {
                        body: t.Object({
                            featureFlags: schemas.featureFlags,
                        })
                    });
            });
    });
