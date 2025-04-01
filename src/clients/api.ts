import { type DiscordGuild } from './discord';
import { type SupabaseGuildConfig } from './supabase';

export const putRegistration = async (guildId: DiscordGuild['id'], registrationConfig: NonNullable<SupabaseGuildConfig['registration']>[number]) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`/guilds/${guildId}/config/registration`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationConfig),
            });

            if (!response.ok) {
                return reject(response.text());
            }

            return resolve(response.json());
        } catch (error) {
            return reject(error);
        }
    });
};
