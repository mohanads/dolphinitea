import { Elysia } from 'elysia';
import { logger } from '../../logger';
import CacheClient from '../../clients/cache';
import type { ISession } from '../../state';

export default () => new Elysia({ name: 'session-plugin' })
    .use((app) => app.derive({ as: 'local' }, async (context): Promise<{ session: ISession }> => {
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
            logger.warn('Received a Session Token, but session was not cached');
            session = { sessionToken: sessionToken.value };
            await CacheClient.set(`SESSION:${sessionToken.value}`, session);
            logger.info('Re-cached the session using the received session token');
        }
        logger.info('Resolved session from cache');
        return { session };
    }));
