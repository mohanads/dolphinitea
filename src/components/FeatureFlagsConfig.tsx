import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
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
        <div className="block w-full bg-discord-black-70 rounded-lg shadow-xl p-6">
            <div className="flex text-lg justify-between mb-2">
                <div>{props.name}</div>
                <label className="inline-flex items-center cursor-pointer relative max-w-min whitespace-nowrap">
                    <input className="sr-only peer" onChange={onChange} type="checkbox" checked={props.value} />
                    <div className="relative w-11 h-6 bg-discord-black-90
                    rounded-full peer peer-checked:after:translate-x-full
                    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
                    after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                    after:bg-white after:border-discord-black-90 after:border after:rounded-full
                    after:h-5 after:w-5 after:transition-all
                    peer-checked:bg-infinitea-orange"
                    >
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
    const onFlagChange = (id: keyof NonNullable<Props['config']>, value: boolean) => { };

    const flagConfigs: FlagConfigProps[] = [
        {
            id: 'create_vc',
            name: 'Create Voice Channel',
            description: 'Automatically creates a new voice channel when a user joins a special one, allowing them to manage their own settings.',
            value: props.config?.create_vc,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'giveaway',
            name: 'Giveaway',
            description: 'Lets users run giveaways using the /giveaway command, choosing where to post the giveaway (a specific channel, message, or the whole server).',
            value: props.config?.giveaway,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'in_voice_count',
            name: 'In Voice Count',
            description: 'Creates a channel that shows the number of people currently in voice channels.',
            value: props.config?.in_voice_count,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'member_count',
            name: 'Member Count',
            description: 'Creates a channel that displays the total number of server members.',
            value: props.config?.member_count,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'navigate',
            name: 'Navigate',
            description: 'Enables the /navigate command for quickly accessing different sub-communities.',
            value: props.config?.navigate,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'register_poe2',
            name: 'PoE2 Registration',
            description: 'Allows users to register for Path of Exile 2-related features using the /register poe2 command.',
            value: props.config?.register_poe2,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'reputation_tracking',
            name: 'Reputation Tracking',
            description: 'Tracks community and staff reputation with leaderboards and the /give_rep command to award points.',
            value: props.config?.reputation_tracking,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'starboard',
            name: 'Starboard',
            description: 'Highlights popular messages by reposting them when they reach a set number of reactions.',
            value: props.config?.starboard,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'status',
            name: 'Server Status',
            description: 'Provides live server status updates using AMP and the /status command.',
            value: props.config?.status,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'temp_message',
            name: 'Temporary Message',
            description: 'Allows users to post temporary messages that automatically disappear after a set time using /temp_message.',
            value: props.config?.temp_message,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'text_xp',
            name: 'Text Leaderboard',
            description: 'Displays the top users based on text activity with the /top_rep command.',
            value: props.config?.text_xp,
            type: 'boolean',
            onChange: onFlagChange,
        },
        {
            id: 'voice_xp',
            name: 'Voice Leaderboard',
            description: 'Shows the most active voice chat participants using the /top_rep command.',
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
