import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['featureFlags'];
}

interface BooleanFlagProps {
    id: string;
    name: string;
    value?: boolean;
    onChange: (id: string, value: boolean) => void;
}

// TODO: narrow `id` type
const BooleanFlag = (props: BooleanFlagProps) => {
    const onChange = (event: any) => {
        props.onChange(props.id, event.target.checked);
    };

    return (
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
            <span className="ms-3 text-sm font-medium">{props.name}</span>
        </label>
    );
};

export default (props: Props) => {
    const onFlagChange = (id: keyof Props['config'], value: boolean) => { };

    return (
        <section className="block w-full bg-discord-black-70 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BooleanFlag id={"create_vc"} name="Create Voice Channel" value={props.config?.create_vc} onChange={onFlagChange} />
            <BooleanFlag id={"giveaway"} name="Giveaway" value={props.config?.giveaway} onChange={onFlagChange} />
            <BooleanFlag id={"in_voice_count"} name="In Voice Count" value={props.config?.in_voice_count} onChange={onFlagChange} />
            <BooleanFlag id={"member_count"} name="Member Count" value={props.config?.member_count} onChange={onFlagChange} />
            <BooleanFlag id={"navigate"} name="Navigate" value={props.config?.navigate} onChange={onFlagChange} />
            <BooleanFlag id={"register_poe2"} name="PoE2 Registration" value={props.config?.register_poe2} onChange={onFlagChange} />
            <BooleanFlag id={"reputation_tracking"} name="Reputation Tracking" value={props.config?.reputation_tracking} onChange={onFlagChange} />
            <BooleanFlag id={"starboard"} name="Starboard" value={props.config?.starboard} onChange={onFlagChange} />
            <BooleanFlag id={"status"} name="Server Status" value={props.config?.status} onChange={onFlagChange} />
            <BooleanFlag id={"temp_message"} name="Temporary Message" value={props.config?.temp_message} onChange={onFlagChange} />
            <BooleanFlag id={"text_xp"} name="Text Leaderboard" value={props.config?.text_xp} onChange={onFlagChange} />
            <BooleanFlag id={"voice_xp"} name="Voice Leaderboard" value={props.config?.voice_xp} onChange={onFlagChange} />
        </section>
    );
}
