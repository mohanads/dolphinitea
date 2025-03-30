import { createClient } from '@supabase/supabase-js';
import * as Errors from '../errors';
import { logger } from '../logger';
import type { Database } from '../database.types';

type Tables = Database['public']['Tables'];

const editableFeatureFlags = ['create_vc', 'giveaway', 'in_voice_count', 'member_count', 'purge', 'reputation_tracking', 'starboard', 'status', 'temp_message', 'text_xp', 'voice_xp'] as const satisfies (keyof Tables['feature_flag_configuration']['Row'])[];

export interface SupabaseGuildConfig {
    amp?: Pick<Tables['amp_configuration']['Row'], 'controller_url' | 'bot_password' | 'bot_username' | 'created_at'> | null;
    starboard?: Pick<Tables['starboard_configuration']['Row'], 'created_at' | 'reaction' | 'required_reactions' | 'updated_at'> | null;
    memberActivity?: Pick<Tables['member_activity_configuration']['Row'], 'create_vc_channel_name' | 'created_at' | 'in_voice_channel_name' | 'member_count_channel_name' | 'updated_at'> | null;
    registration?: (Pick<Tables['registration_config']['Row'], 'dm_approval_body' | 'dm_approval_footer' | 'dm_approval_title' | 'dm_delay_body' | 'dm_delay_footer' | 'dm_delay_title' | 'dm_registered_body' | 'dm_registered_footer' | 'dm_registered_title' | 'game_name' | 'guild_id' | 'log_channel_url' | 'registration_channel_url' | 'registration_embed_body' | 'registration_embed_footer' | 'registration_embed_title'> & { fields: Pick<Tables['registration_field']['Row'], 'field_title'>[] })[] | null;
    featureFlags?: Pick<Tables['feature_flag_configuration']['Row'], 'create_vc' | 'giveaway' | 'in_voice_count' | 'member_count' | 'purge' | 'reputation_tracking' | 'starboard' | 'status' | 'temp_message' | 'text_xp' | 'voice_xp' | 'created_at'> | null;
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
                featureFlags:feature_flag_configuration (create_vc, created_at, giveaway, in_voice_count, member_count, purge, reputation_tracking, starboard, status, temp_message, text_xp, voice_xp),
                starboard:starboard_configuration (created_at, reaction, required_reactions, updated_at),
                memberActivity:member_activity_configuration (create_vc_channel_name, created_at, in_voice_channel_name, member_count_channel_name, updated_at),
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

    async putFeatureFlags(guildId: string, featureFlags: Partial<NonNullable<SupabaseGuildConfig['featureFlags']>>) {
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

    async putRegistration(guildId: string, gameName: string, registration: NonNullable<SupabaseGuildConfig['registration']>[0]) {
        const logMetadata: Record<string, unknown> = {
            guildId,
            gameName,
        };

        if (!guildId) {
            logger.error('Supabase Guild ID missing for updating Registration', logMetadata);
            throw new Errors.LoadedError(Errors.Code.SUPABASE_GUILD_ID_MISSING);
        }

        if (!gameName) {
            logger.error('Supabase Game Name missing for updating Registration', logMetadata);
            throw new Errors.LoadedError(Errors.Code.SUPABASE_REGISTRATION_GAME_NAME_MISSING);
        }

        // TODO: proper validation with a defined schema
        if (!registration) {
            logger.error('Invalid Registration object to update', logMetadata);
            throw new Errors.LoadedError(Errors.Code.SUPABASE_INVALID_REGISTRATION);
        }

        const registrationConfig = await this.supabase
            .from('registration_config')
            .select('guildId')
            .eq('guild_id', guildId as any)
            .eq('game_name', gameName)
            .maybeSingle();

        if (registrationConfig.error) {
            logMetadata.errorMessage = registrationConfig.error?.message || registrationConfig.error;
            logger.warn('Failed to fetch Registration Config', logMetadata);
            throw new Errors.LoadedError(Errors.Code.SUPABASE_UNKNOWN_ERROR);
        }

        const upsertedRegistrationConfig = await this.supabase.rpc('put_registration_config', {
            guild_id: guildId as any,
            game_name: gameName,
            dm_approval_title: registration.dm_approval_title,
            dm_approval_body: registration.dm_approval_body,
            dm_approval_footer: registration.dm_approval_footer as any,
            dm_delay_title: registration.dm_delay_title,
            dm_delay_body: registration.dm_delay_body,
            dm_delay_footer: registration.dm_approval_footer as any,
            dm_registered_title: registration.dm_registered_title,
            dm_registered_body: registration.dm_registered_body,
            dm_registered_footer: registration.dm_registered_footer as any,
            registration_embed_title: registration.registration_embed_title,
            registration_embed_body: registration.registration_embed_body,
            registration_embed_footer: registration.registration_embed_footer,
            log_channel_url: registration.log_channel_url as any,
            registration_channel_url: registration.registration_channel_url as any,
            fields: registration.fields.map((field) => ({
                field_title: field.field_title,
                guild_id: guildId,
                game_name: gameName,
            })),
        });

        if (upsertedRegistrationConfig.error) {
            logMetadata.errorMessage = upsertedRegistrationConfig.error?.message || upsertedRegistrationConfig.error;
            logger.warn('Failed to put Registration Config', logMetadata);
            throw new Errors.LoadedError(Errors.Code.SUPABASE_UNKNOWN_ERROR);
        }

        logger.info('Successfully put Registration Config', logMetadata);
        return;
    }
}

export default new SupabaseClient();
