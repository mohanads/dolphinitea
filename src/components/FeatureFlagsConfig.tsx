import { i18n } from '@lingui/core';
import toast from 'react-hot-toast';
import { DiscordGuild } from '../clients/discord';
import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    guildId: DiscordGuild['id'];
    config: SupabaseGuildConfig['featureFlags'];
}

interface BooleanFlagProps {
    id: string;
    name: string;
    description: string;
    value?: boolean;
    onChange: (id: string, value: boolean) => void;
}

// TODO: narrow `id` type
const BooleanFlag = (props: BooleanFlagProps) => {
    const onChange = (event: any) => {
        props.onChange(props.id, event.target.checked);
    };

    return (
        <div className="block w-full bg-discord-black-80 rounded-lg shadow-xl p-6">
            <div className="flex text-lg justify-between mb-2">
                <div>{props.name}</div>
                <label className="inline-flex items-center cursor-pointer relative max-w-min whitespace-nowrap">
                    <input className="sr-only peer" onChange={onChange} type="checkbox" checked={props.value} />
                    <div className="relative w-11 h-6 bg-discord-black-70
                    rounded-full peer peer-checked:after:translate-x-full
                    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
                    after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                    after:bg-white after:border-discord-black-70 after:border after:rounded-full
                    after:h-5 after:w-5 after:transition-all
                    peer-checked:bg-infinitea-orange">
                    </div>
                </label>
            </div>
            <div className="text-sm text-gray-400/75">{props.description}</div>
        </div>
    );
};

interface FlagConfigProps extends BooleanFlagProps {
    type: 'boolean';
};

const FlagConfig = (props: FlagConfigProps) => {
    switch (props.type) {
        case 'boolean':
            return <BooleanFlag id={props.id} name={props.name} description={props.description} value={props.value} onChange={props.onChange} />
        default:
            return {} as never;
    }
};

export default (props: Props) => {
    const onFlagChange = async (id: keyof NonNullable<Props['config']>, value: boolean) => {
        // TODO: move api calls to an API util (move all calls)
        const putConfig = () => fetch(`/guilds/${props.guildId}/config/featureFlags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [id]: value,
            }),
        });

        toast.promise(putConfig, {
            loading: i18n.t('Syncing config...'),
            success: i18n.t('Config synced!'),
            error: i18n.t('Sync failed!'),
        });
    };

    const flagConfigs: FlagConfigProps[] = [
        {
            id: 'create_vc',
            name: i18n.t('Create Voice Channel'),
            description: i18n.t('Automatically creates a new voice channel when a user joins a special one, allowing them to manage their own settings.'),
            value: props.config?.create_vc,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'giveaway',
            name: i18n.t('Giveaway'),
            description: i18n.t('Lets users run giveaways using the /giveaway command, choosing where to post the giveaway (a specific channel, message, or the whole server).'),
            value: props.config?.giveaway,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'in_voice_count',
            name: i18n.t('In Voice Count'),
            description: i18n.t('Creates a channel that shows the number of people currently in voice channels.'),
            value: props.config?.in_voice_count,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'member_count',
            name: i18n.t('Member Count'),
            description: i18n.t('Creates a channel that displays the total number of server members.'),
            value: props.config?.member_count,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'reputation_tracking',
            name: i18n.t('Reputation Tracking'),
            description: i18n.t('Tracks community and staff reputation with leaderboards and the /give_rep command to award points.'),
            value: props.config?.reputation_tracking,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'starboard',
            name: i18n.t('Starboard'),
            description: i18n.t('Highlights popular messages by reposting them when they reach a set number of reactions.'),
            value: props.config?.starboard,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'status',
            name: i18n.t('Server Status'),
            description: i18n.t('Provides live server status updates using AMP and the /status command.'),
            value: props.config?.status,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'temp_message',
            name: i18n.t('Temporary Message'),
            description: i18n.t('Allows users to post temporary messages that automatically disappear after a set time using /temp_message.'),
            value: props.config?.temp_message,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'text_xp',
            name: i18n.t('Text Leaderboard'),
            description: i18n.t('Displays the top users based on text activity with the /top_rep command.'),
            value: props.config?.text_xp,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'voice_xp',
            name: i18n.t('Voice Leaderboard'),
            description: i18n.t('Shows the most active voice chat participants using the /top_rep command.'),
            value: props.config?.voice_xp,
            type: 'boolean',
            onChange: onFlagChange,
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {flagConfigs.map(({ id, type, name, description, value, onChange }) => (
                <FlagConfig id={id} type={type} name={name} description={description} value={value} onChange={onChange} />
            ))}
        </section>
    );
}
