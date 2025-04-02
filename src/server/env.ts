import { InfisicalSDK } from '@infisical/sdk'
import { logger } from './logger';

const client = new InfisicalSDK({
    siteUrl: "https://app.infisical.com",
});

await client.auth().universalAuth.login({
    clientId: process.env.INFISICAL_MACHINE_IDENTITY_CLIENT_ID as string,
    clientSecret: process.env.INFISICAL_MACHINE_IDENTITY_CLIENT_SECRET as string,
});

const allSecrets = await client.secrets().listSecrets({
    environment: process.env.INFISICAL_ENVIRONMENT as string,
    projectId: process.env.INFISICAL_PROJECT_ID as string,
});

if (!allSecrets) {
    logger.error('Failed to load Secrets');
    throw new Error('Failed to load Secrets');
}

allSecrets.secrets.forEach((secret) => {
    process.env[secret.secretKey] = secret.secretValue;
});

logger.info('Finished loading Secrets');
