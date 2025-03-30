import { type Context, Elysia } from 'elysia';
import { logger } from '../../logger';
import LaunchDarklyClient, { type FeatureFlag } from '../../clients/launchDarkly';
import { type ISession } from '../../state';

export default () => new Elysia({ name: 'feature-flags-plugin' })
    .use((app) => app.derive({ as: 'scoped' }, async (context: Context & { session: ISession; }) => {
        const { user } = context.session;
        if (!user) {
            logger.info('No user in session; Skipping Feature Flags.');
            return { featureFlags: {} as Record<FeatureFlag, unknown> };
        }

        logger.info('Fetching Feature Flags')
        const featureFlags = await LaunchDarklyClient.getAllFlags({ userId: user!.id, userName: user!.username, userEmail: user!.email });
        if (!featureFlags) {
            logger.info('No Feature Flags returned from LaunchDarkly');
            return { featureFlags: {} as Record<FeatureFlag, unknown> };
        }

        logger.info('Fetched Feature Flags');
        return { featureFlags };
    }));
