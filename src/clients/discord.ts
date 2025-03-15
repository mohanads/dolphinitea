import * as Errors from '../errors';
import { logger } from '../logger';

export class DiscordClient {
    private apiUrl: string;
    private redirectUri: string;
    private clientId: string;
    private clientSecret: string;
    private botToken: string;

    constructor(options?) {
        const { apiUrl, redirectUri, clientId, clientSecret, botToken, } = options || {};

        if (apiUrl && redirectUri && clientId && clientSecret && botToken) {
            this.apiUrl = apiUrl;
            this.redirectUri = redirectUri;
            this.clientId = clientId;
            this.clientSecret = clientSecret;
            this.botToken = this.botToken;
        } else {
            logger.debug('Initializing Discord client directly from env vars');
            const { DISCORD_API_URL, DISCORD_REDIRECT_URI, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN } = process.env;

            if (!DISCORD_API_URL) throw new Errors.LoadedError(Errors.Code.DISCORD_API_URL_MISSING);
            if (!DISCORD_REDIRECT_URI) throw new Errors.LoadedError(Errors.Code.DISCORD_REDIRECT_MISSING);
            if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) throw new Errors.LoadedError(Errors.Code.DISCORD_AUTH_MISSING);
            if (!DISCORD_BOT_TOKEN) throw new Errors.LoadedError(Errors.Code.DISCORD_BOT_TOKEN_MISSING);

            this.apiUrl = DISCORD_API_URL;
            this.redirectUri = DISCORD_REDIRECT_URI;
            this.clientId = DISCORD_CLIENT_ID;
            this.clientSecret = DISCORD_CLIENT_SECRET;
            this.botToken = DISCORD_BOT_TOKEN;
        }
    }

    /**
     * @param authCode The auth code returned by OAuth2.
     */
    async consumeAuthCode(authCode: string) {
        logger.debug('Consuming auth code');
        if (!authCode) {
            logger.warn('No auth code was passed to consume');
            throw new Errors.LoadedError(Errors.Code.DISCORD_AUTH_CODE_MISSING);
        }

        logger.debug('Attempting to consume user auth code');
        const response = await fetch(`${this.apiUrl}/oauth2/token`, {
            method: 'POST',
            body: new URLSearchParams({
                code: authCode,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }),
        });
        const data = await response.json() as DiscordAuth | DiscordError;
        if ('retry_after' in data || 'message' in data) {
            logger.error('Failed to consume auth code', {
                errorMessage: data.message,
            });
            return undefined;
        }
        logger.debug('Consumed user auth code');
        return data;
    }

    async getUser(accessToken: string) {
        if (!accessToken) {
            logger.warn('No Discord access token passed to make @me API call', { accessToken });
            throw new Errors.LoadedError(Errors.Code.DISCORD_ACCESS_TOKEN_MISSING);
        }

        logger.debug('Attempting to fetch user details');
        const response = await fetch(`${this.apiUrl}/oauth2/@me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json() as DiscordUser & Record<string, unknown> | DiscordError;
        if ('retry_after' in data || 'message' in data) {
            logger.error('Failed to fetch user', {
                errorMessage: data.message,
            });
            return undefined;
        }
        logger.debug('Fetched user details', {
            userId: data.user.id,
            userName: data.user.username,
        });
        const { user: { id, global_name, username, banner, accent_color, avatar, avatar_decoration_data } } = data;
        return { id, global_name, username, banner, accent_color, avatar, avatar_decoration_data };
    };

    async getUserGuilds(accessToken: string) {
        if (!accessToken) {
            logger.warn('No Discord access token passed to make @me/guilds API call', { accessToken });
            throw new Errors.LoadedError(Errors.Code.DISCORD_ACCESS_TOKEN_MISSING);
        }

        logger.debug('Attempting to fetch user guilds');
        const response = await fetch(`${this.apiUrl}/users/@me/guilds`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json() as (DiscordGuild[] & Record<string, unknown>) | DiscordError;
        if ('retry_after' in data || 'message' in data) {
            logger.error('Failed to fetch user Guilds', {
                errorMessage: data.message,
            });
            return undefined;
        }
        const guilds = data.map(({ id, name, icon, banner, description }) => ({ id, name, icon, banner, description }));
        logger.debug('Fetched user guilds');
        return guilds;
    };

    async getBotGuilds() {
        logger.debug('Attempting to fetch bot guilds');
        const response = await fetch(`${this.apiUrl}/users/@me/guilds`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${this.botToken}`,
            },
        });
        const data = await response.json() as DiscordGuild[] | DiscordError;
        if ('retry_after' in data || 'message' in data) {
            logger.error('Failed to fetch Bot Guilds', {
                errorMessage: data.message,
            });
            return undefined;
        }
        logger.debug('Fetched bot guilds');
        return data;
    };
}

export interface DiscordAuth {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export interface DiscordUser {
    user: {
        id: string;
        username: string;
        global_name?: string;
        avatar?: string;
        banner?: string;
        accent_color?: number | null;
        // avatar_decoration_data?: null;
        // discriminator?: string;
        // public_flags?: number;
        // flags?: number;
        // collectibles?: null;
        // banner_color?: null;
        // clan?: null;
        // primary_guild?: null;
    }
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon?: string;
    banner?: string;
    description?: string;
    // owner: boolean;
    // permissions: number;
    // permissions_new: string;
    // features: string[];
}

export interface DiscordError {
    message: string;
    retry_after: number;
    global: boolean;
}

export default new DiscordClient();
