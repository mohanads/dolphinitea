import { createContext } from 'preact';
import { DiscordGuild, DiscordUser } from './clients/discord';
import { SupabaseGuildConfig } from './clients/supabase';
import { FeatureFlag } from './clients/launchDarkly';

export const CLIENT_DATA_KEY = '__INIT_DATA__';

export interface ISession {
    sessionToken: string;
    discordAccessToken?: string;
    discordRefreshToken?: string;
    user?: DiscordUser['user'];
    userGuilds?: DiscordGuild[];
    displayGuilds?: DiscordGuild[];
}

export type IState = {
    sessionToken: string;
    featureFlags: Record<FeatureFlag, unknown>;
    error?: string;
    unauthorized?: boolean;
} & ({
    user?: DiscordUser['user'];
    displayGuilds?: DiscordGuild[];
} | {
    user: DiscordUser['user'];
    displayGuilds: DiscordGuild[];
}) & ({
    guildConfig?: SupabaseGuildConfig;
    guild?: DiscordGuild;
} | {
    guildConfig: SupabaseGuildConfig;
    guild: DiscordGuild;
})

const getClientData = () => {
    if (typeof window === 'undefined') return undefined;
    const dataEl = window.document.getElementById(CLIENT_DATA_KEY);
    if (!dataEl?.textContent) return;
    return JSON.parse(dataEl?.textContent);
};

export const State = createContext<IState>({} as any);

export const createState = (state?: IState) => {
    return {
        ...state,
        ...getClientData(),
    };
}
