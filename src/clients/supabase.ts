import { createClient } from '@supabase/supabase-js';
import * as Errors from '../errors';
import { logger } from '../logger';
import type { Database } from '../database.types';

type Tables = Database['public']['Tables'];

const editableFeatureFlags = ['create_vc', 'giveaway', 'in_voice_count', 'member_count', 'purge', 'register_poe2', 'reputation_tracking', 'starboard', 'status', 'temp_message', 'text_xp', 'voice_xp'] as const satisfies (keyof Tables['feature_flag_configuration']['Row'])[];

export interface SupabaseGuildConfig {
    amp?: Pick<Tables['amp_configuration']['Row'], 'controller_url' | 'bot_password' | 'bot_username' | 'created_at'> | null;
    starboard?: Pick<Tables['starboard_configuration']['Row'], 'created_at' | 'reaction' | 'required_reactions' | 'updated_at'> | null;
    memberActivity?: Pick<Tables['member_activity_configuration']['Row'], 'create_vc_channel_name' | 'created_at' | 'in_voice_channel_name' | 'member_count_channel_name' | 'updated_at'> | null;
    poe2Registration?: Pick<Tables['poe2_registration_configuration']['Row'], 'allowed_maximum_reports' | 'approved_dm_message' | 'approved_dm_title' | 'channel_embed_footer' | 'channel_embed_message' | 'channel_embed_title' | 'channel_url' | 'created_at' | 'delayed_dm_message' | 'delayed_dm_title' | 'notification_channel_url' | 'utility_role_id'> | null;
    registration?: (Pick<Tables['registration_config']['Row'], 'dm_approval_body' | 'dm_approval_footer' | 'dm_approval_title' | 'dm_delay_body' | 'dm_delay_footer' | 'dm_delay_title' | 'dm_registered_body' | 'dm_registered_footer' | 'dm_registered_title' | 'game_name' | 'guild_id' | 'log_channel_url' | 'registration_channel_url' | 'registration_embed_body' | 'registration_embed_footer' | 'registration_embed_title'> & { fields: Pick<Tables['registration_field']['Row'], 'field_title'>[] })[] | null;
    featureFlags?: Pick<Tables['feature_flag_configuration']['Row'], 'create_vc' | 'giveaway' | 'in_voice_count' | 'member_count' | 'purge' | 'register_poe2' | 'reputation_tracking' | 'starboard' | 'status' | 'temp_message' | 'text_xp' | 'voice_xp' | 'created_at'> | null;
}

export class SupabaseClient {
    private apiUrl: string;
    private apiKey: string;
    private supabase: ReturnType<typeof createClient<Database>>;

    constructor(options?) {
        const { apiUrl, apiKey } = options || {};

        if (apiUrl && apiKey) {
            this.apiUrl = apiUrl;
            this.apiKey = apiKey;
        } else {
            logger.debug('Initializing Supabase client directly from env vars');
            const { SUPABASE_API_URL, SUPABASE_API_KEY } = process.env;

            if (!SUPABASE_API_URL) throw new Errors.LoadedError(Errors.Code.DISCORD_API_URL_MISSING);
            if (!SUPABASE_API_KEY) throw new Errors.LoadedError(Errors.Code.DISCORD_REDIRECT_MISSING);

            this.apiUrl = SUPABASE_API_URL;
            this.apiKey = SUPABASE_API_KEY;
            this.supabase = createClient(this.apiUrl, this.apiKey);
        }
    }

    async getGuildConfigs(guildId: string): Promise<SupabaseGuildConfig | undefined> {
        if (!guildId) {
            logger.error('Supabase Guild ID missing for fetching', {
                guildId,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_GUILD_ID_MISSING);
        }

        const { data, error } = await this.supabase
            .from('configuration')
            .select(`
                amp:amp_configuration (controller_url, bot_password, bot_username, created_at),
                featureFlags:feature_flag_configuration (create_vc, created_at, giveaway, in_voice_count, member_count, purge, register_poe2, reputation_tracking, starboard, status, temp_message, text_xp, voice_xp),
                starboard:starboard_configuration (created_at, reaction, required_reactions, updated_at),
                memberActivity:member_activity_configuration (create_vc_channel_name, created_at, in_voice_channel_name, member_count_channel_name, updated_at),
                poe2Registration:poe2_registration_configuration (allowed_maximum_reports, approved_dm_message, approved_dm_title, channel_embed_footer, channel_embed_message, channel_embed_title, channel_url, created_at, delayed_dm_message, delayed_dm_title, notification_channel_url, utility_role_id),
                registration:registration_config (dm_approval_body, dm_approval_footer, dm_approval_title, dm_delay_body, dm_delay_footer, dm_delay_title, dm_registered_body, dm_registered_footer, dm_registered_title, game_name, guild_id, log_channel_url, registration_channel_url, registration_embed_body, registration_embed_footer, registration_embed_title, fields:registration_field(field_title))
            `)
            .eq('guild_id', guildId as any)
            .maybeSingle();

        if (error) {
            logger.error('Supabase failed to get Guild configs', {
                errorMessage: error?.message || error,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_UNKNOWN_ERROR);
        }

        return data || undefined;
    }

    async getGuildConfigId(guildId: string) {
        const { data, error } = await this.supabase
            .from('configuration')
            .select(`id`)
            .eq('guild_id', guildId as any)
            .maybeSingle();

        if (error) {
            logger.warn('Failed to fetch Feature Flags config', {
                guildId,
                errorMessage: error?.message || error,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_UNKNOWN_ERROR);
        }

        return data?.id;
    }

    async updateFeatureFlags(guildId: string, featureFlags: Partial<NonNullable<SupabaseGuildConfig['featureFlags']>>) {
        if (!guildId) {
            logger.error('Supabase Guild ID missing for updating Feature Flags', {
                guildId,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_GUILD_ID_MISSING);
        }

        const update = <Record<typeof editableFeatureFlags[number], boolean>>{}

        editableFeatureFlags.forEach((flagName) => {
            if (flagName in featureFlags && typeof featureFlags[flagName] === 'boolean') {
                update[flagName] = featureFlags[flagName];
            }
        });

        const configId = await this.getGuildConfigId(guildId);

        if (!configId) {
            // TOOD: maybe we want to insert when config doesn't exist
            logger.warn('Found no Config for Guild during Config update', {
                guildId,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_CONFIG_MISSING);
        }

        const guildConfigUpdate = await this.supabase
            .from('feature_flag_configuration')
            .update(update)
            .eq('id', configId);

        if (guildConfigUpdate.error) {
            logger.warn('Failed to update Feature Flags config', {
                guildId,
                errorMessage: guildConfigUpdate.error?.message || guildConfigUpdate.error,
            });
            throw new Errors.LoadedError(Errors.Code.SUPABASE_UNKNOWN_ERROR);
        }
    }
}

export default new SupabaseClient();
