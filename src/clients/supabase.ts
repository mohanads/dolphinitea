import { createClient } from '@supabase/supabase-js';
import * as Errors from '../errors';
import type { Database } from '../database.types';
import { logger } from '../logger';

type Tables = Database['public']['Tables'];

export interface SupabaseGuildConfig {
    amp?: Pick<Tables['amp_configuration']['Row'], 'controller_url' | 'bot_password' | 'bot_username' | 'created_at'> | null;
    starboard?: Pick<Tables['starboard_configuration']['Row'], 'channel_name' | 'created_at' | 'reaction' | 'required_reactions' | 'updated_at'>;
    memberActivity?: Pick<Tables['member_activity_configuration']['Row'], 'create_vc_channel_name' | 'created_at' | 'in_voice_channel_name' | 'member_count_channel_name' | 'updated_at'>;
    poe2Registration?: Pick<Tables['poe2_registration_configuration']['Row'], 'allowed_maximum_reports' | 'approved_dm_message' | 'approved_dm_title' | 'channel_embed_footer' | 'channel_embed_message' | 'channel_embed_title' | 'channel_url' | 'created_at' | 'delayed_dm_message' | 'delayed_dm_title' | 'notification_channel_url' | 'utility_role_id'>;
    featureFlags?: Pick<Tables['feature_flag_configuration']['Row'], 'id' | 'create_vc' | 'giveaway' | 'in_voice_count' | 'member_count' | 'navigate' | 'purge' | 'register_poe2' | 'reload' | 'reputation_tracking' | 'starboard' | 'status' | 'temp_message' | 'text_xp' | 'voice_xp' | 'created_at'>;
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
                id::text,
                guild_id::text,
                amp:amp_configuration (controller_url, bot_password, bot_username, created_at)
                starboard:starboard_configuration (channel_name, created_at, reaction, required_reactions, updated_at)
                memberActivity:member_activity_configuration (create_vc_channel_name, created_at, in_voice_channel_name, member_count_channel_name, updated_at)
                poe2Registration:poe2_registration_configuration (allowed_maximum_reports, approved_dm_message, approved_dm_title, channel_embed_footer, channel_embed_message, channel_embed_title, channel_url, created_at, delayed_dm_message, delayed_dm_title, notification_channel_url, utility_role_id)
                featureFlags:feature_flag_configuration (create_vc_channel_name, created_at, in_voice_channel_name, member_count_channel_name, updated_at)
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
}

export default new SupabaseClient();
