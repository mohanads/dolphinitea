import * as LaunchDarkly from '@launchdarkly/node-server-sdk';
import * as Errors from '../errors';
import { logger } from '../logger';

export enum FeatureFlag {
    FeatureFlagConfigKillSwitch = 'feature-flags-config-kill-switch',
    StarboardConfigKillSwitch = 'starboard-config-kill-switch',
    MemberActivityConfigKillSwitch = 'member-activity-kill-switch',
    AMPConfigKillSwitch = 'amp-config-kill-switch',
}

export interface LaunchDarklyContext {
    userId: string;
    userName: string;
    userEmail?: string;
}

export class LaunchDarklyClient {
    private sdkKey: string;
    private sdkClient: LaunchDarkly.LDClient;

    constructor(options?) {
        const { sdkKey } = options || {};

        if (sdkKey) {
            this.sdkKey = sdkKey;
        } else {
            logger.debug('Initializing LaunchDarkly client directly from env vars');
            const { LAUNCHDARKLY_SDK_KEY } = process.env;

            if (!LAUNCHDARKLY_SDK_KEY) throw new Errors.LoadedError(Errors.Code.DISCORD_API_URL_MISSING);

            this.sdkKey = LAUNCHDARKLY_SDK_KEY;
            this.sdkClient = LaunchDarkly.init(this.sdkKey);
        }
    }

    private async ensureConnected() {
        await this.sdkClient.waitForInitialization({ timeout: 10 });
    }

    async getFlag(flagName: FeatureFlag, context: LaunchDarklyContext) {
        await this.ensureConnected();

        const { userId, userEmail, userName } = context;

        try {
            return this.sdkClient.variation(flagName, {
                kind: 'user',
                key: userId,
                name: userName,
                email: userEmail,
            }, null);
        } catch (error) {
            logger.error('Failed to fetch LaunchDarkly flag', {
                flagName,
                userId,
                userEmail,
                userName,
            });

            return null;
        }
    }

    async getAllFlags(context: LaunchDarklyContext) {
        await this.ensureConnected();

        const { userId, userEmail, userName } = context;

        try {
            const state = await this.sdkClient.allFlagsState({
                kind: 'user',
                key: userId,
                name: userName,
                email: userEmail,
            });

            return state.allValues() as Record<FeatureFlag, unknown>;
        } catch (error) {
            logger.error('Failed to fetch LaunchDarkly all flags state', {
                userId,
                userEmail,
                userName,
            });

            return undefined;
        }
    }
}

export default new LaunchDarklyClient();
