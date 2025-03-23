export enum Code {
    DISCORD_REDIRECT_MISSING = 'ERR_DISC1000',
    DISCORD_AUTH_MISSING = 'ERR_DISC1001',
    DISCORD_API_URL_MISSING = 'ERR_DISC1002',
    DISCORD_AUTH_CODE_MISSING = 'ERR_DISC1003',
    DISCORD_ACCESS_TOKEN_MISSING = 'ERR_DISC1004',
    DISCORD_BOT_TOKEN_MISSING = 'ERR_DISC1005',
    CACHE_URL_MISSING = 'ERR_CACHE1000',
    CACHE_CREDENTIALS_MISSING = 'ERR_CACHE1001',
    SUPABASE_API_URL_MISSING = 'ERR_SBS1000',
    SUPABASE_AUTH_MISSING = 'ERR_SBS1001',
    SUPABASE_GUILD_ID_MISSING = 'ERR_SBS1002',
    SUPABASE_UNKNOWN_ERROR = 'ERR_SBS1003',
    SUPABASE_CONFIG_MISSING = 'ERR_SBS1004',
    CMS_CONFIG_MISSING = 'ERR_CMS1000',
    UNAUTHORIZED_CONFIG_ACCESS = 'ERR_CFG1000',
    INVALID_CONFIG_UPDATE = 'ERR_CFG1001',
}

enum Namespace {
    SUPABASE = 'Supabase',
    DISCORD = 'Discord',
    CACHE = 'Cache',
    CMS = 'CMS',
    INTERNAL = 'Internal',
}

const messages = {
    [Code.DISCORD_REDIRECT_MISSING]: 'Discord redirect URI missing',
    [Code.DISCORD_AUTH_MISSING]: 'Discord auth credentials missing',
    [Code.DISCORD_API_URL_MISSING]: 'Discord API URL missing',
    [Code.DISCORD_AUTH_CODE_MISSING]: 'No Discord auth code given',
    [Code.DISCORD_ACCESS_TOKEN_MISSING]: 'No Discord access token given',
    [Code.DISCORD_BOT_TOKEN_MISSING]: 'Discord bot token missing',
    [Code.CACHE_URL_MISSING]: 'Cache URL is missing',
    [Code.CACHE_CREDENTIALS_MISSING]: 'Cache credentials missing',
    [Code.SUPABASE_API_URL_MISSING]: 'Supabase URL is missing',
    [Code.SUPABASE_AUTH_MISSING]: 'Supabase auth credentials missing',
    [Code.SUPABASE_GUILD_ID_MISSING]: 'Supabase Guild ID missing for fetching',
    [Code.SUPABASE_UNKNOWN_ERROR]: 'Supabase unknown error occurred',
    [Code.SUPABASE_CONFIG_MISSING]: 'Supabase Guild Config is missing',
    [Code.CMS_CONFIG_MISSING]: 'CMS Config is missing',
    [Code.UNAUTHORIZED_CONFIG_ACCESS]: 'Config unauthorized user access',
    [Code.INVALID_CONFIG_UPDATE]: 'Invalid Config update attempt',
} as const satisfies Record<Code, string>;

const namespaces = {
    [Code.DISCORD_REDIRECT_MISSING]: Namespace.DISCORD,
    [Code.DISCORD_AUTH_MISSING]: Namespace.DISCORD,
    [Code.DISCORD_API_URL_MISSING]: Namespace.DISCORD,
    [Code.DISCORD_AUTH_CODE_MISSING]: Namespace.DISCORD,
    [Code.DISCORD_ACCESS_TOKEN_MISSING]: Namespace.DISCORD,
    [Code.DISCORD_BOT_TOKEN_MISSING]: Namespace.DISCORD,
    [Code.CACHE_URL_MISSING]: Namespace.CACHE,
    [Code.CACHE_CREDENTIALS_MISSING]: Namespace.CACHE,
    [Code.SUPABASE_API_URL_MISSING]: Namespace.SUPABASE,
    [Code.SUPABASE_AUTH_MISSING]: Namespace.SUPABASE,
    [Code.SUPABASE_GUILD_ID_MISSING]: Namespace.SUPABASE,
    [Code.SUPABASE_UNKNOWN_ERROR]: Namespace.SUPABASE,
    [Code.SUPABASE_CONFIG_MISSING]: Namespace.SUPABASE,
    [Code.CMS_CONFIG_MISSING]: Namespace.CMS,
    [Code.UNAUTHORIZED_CONFIG_ACCESS]: Namespace.INTERNAL,
    [Code.INVALID_CONFIG_UPDATE]: Namespace.INTERNAL,
} as const satisfies Record<Code, Namespace>;

export class LoadedError extends Error {
    code: Code;
    namespace: Namespace;

    constructor(code: Code) {
        super(messages[code]);
        this.code = code;
        this.namespace = namespaces[code];
    }
}
