import * as Errors from '../errors';

export class DiscordClient {
    private apiUrl: string;
    private redirectUri: string;
    private clientId: string;
    private clientSecret: string;

    constructor(options?) {
        const { apiUrl, redirectUri, clientId, clientSecret, } = options || {};

        if (apiUrl && redirectUri && clientId && clientSecret) {
            this.apiUrl = apiUrl;
            this.redirectUri = redirectUri;
            this.clientId = clientId;
            this.clientSecret = clientSecret;
        } else {
            console.debug('Initializing Discord client directly from env vars');
            const { DISCORD_API_URL, DISCORD_REDIRECT_URI, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

            if (!DISCORD_API_URL) throw new Errors.LoadedError(Errors.Code.DISCORD_API_URL_MISSING);
            if (!DISCORD_REDIRECT_URI) throw new Errors.LoadedError(Errors.Code.DISCORD_REDIRECT_MISSING);
            if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) throw new Errors.LoadedError(Errors.Code.DISCORD_AUTH_MISSING);

            this.apiUrl = DISCORD_API_URL;
            this.redirectUri = DISCORD_REDIRECT_URI;
            this.clientId = DISCORD_CLIENT_ID;
            this.clientSecret = DISCORD_CLIENT_SECRET;
        }
    }

    /**
     * @param authCode The auth code returned by OAuth2.
     */
    async consumeAuthCode(authCode: string) {
        if (!authCode) {
            console.warn('No auth code was passed to consume', { authCode });
            throw new Errors.LoadedError(Errors.Code.DISCORD_AUTH_CODE_MISSING);
        }

        console.log('Attempting to consume user auth code', { authCode });

        const response = await (await fetch(`${this.apiUrl}/oauth2/token`, {
            method: 'POST',
            body: new URLSearchParams({
                code: authCode,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }),
        })).json() as DiscordAuth;

        console.log('Consumed user auth code', { authCode });
        console.log(response);

        return response;
    }

    async getUser(accessToken: string) {
        if (!accessToken) {
            console.warn('No Discord access token passed to make @me API call', { accessToken });
            throw new Errors.LoadedError(Errors.Code.DISCORD_ACCESS_TOKEN_MISSING);
        }

        console.log('Attempting to fetch user details', { accessToken });

        const response = await (await fetch(`${this.apiUrl}/oauth2/@me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json() as DiscordUser;

        console.log('Fetched user details', {
            accessToken,
            userId: response.user.id,
            userName: response.user.username,
        });

        return response;
    };

    async getGuilds(accessToken: string) {
        if (!accessToken) {
            console.warn('No Discord access token passed to make @me/guilds API call', { accessToken });
            throw new Errors.LoadedError(Errors.Code.DISCORD_ACCESS_TOKEN_MISSING);
        }

        console.log('Attempting to fetch user guilds', { accessToken });
        const response = await fetch(`${this.apiUrl}/users/@me/guilds`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json() as DiscordGuild[] | DiscordError;
        if ('retry_after' in data) {
            console.error('Failed to fetch Discord Guilds', {
                accessToken,
                errorMessage: data.message,
            });
            return undefined;
        }
        console.log('Fetched user guilds', { accessToken });
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
        avatar?: string | null;
        discriminator?: string;
        public_flags?: number;
        flags?: number;
        banner: null;
        accent_color?: null;
        global_name: string;
        avatar_decoration_data?: null;
        collectibles?: null;
        banner_color?: null;
        clan?: null;
        primary_guild?: null;
    }
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string;
    banner: string;
    owner: boolean;
    permissions: number;
    permissions_new: string;
    features: string[];
}

export interface DiscordError {
    message: string;
    retry_after: number;
    global: boolean;
}

export default new DiscordClient();
