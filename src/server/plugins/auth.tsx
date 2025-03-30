import { h } from 'preact';
import Elysia, { Context } from 'elysia';
import CacheClient from '../../clients/cache';
import DiscordClient from '../../clients/discord';
import { logger } from '../../logger';
import render from '../render';
import { ISession } from '../../state';
import { FeatureFlag } from '../../clients/launchDarkly';

export default () => new Elysia()
    .put('/logout', async (context) => {
        const { sessionToken } = context.cookie;
        if (!sessionToken?.value) return;
        await CacheClient.delete(sessionToken.value);
    })
    .get('/oauth2', async (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
        logger.info("Consuming auth code");
        const auth = await DiscordClient.consumeAuthCode(context.query.code);
        logger.info("Consumed user auth code");

        if (!auth) {
            return 'Failed to consume auth code. Please try again.';
        }

        const user = await DiscordClient.getUser(auth.access_token);
        context.session.user = user;
        context.session.discordAccessToken = auth.access_token;
        context.session.discordRefreshToken = auth.refresh_token;
        await CacheClient.set(`SESSION:${context.session.sessionToken}`, context.session);
        logger.info('Cached Discord user, access & refresh tokens into session');

        context.set.headers = { 'Content-Type': 'text/html' };
        return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
    });
