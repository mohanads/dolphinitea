import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['memberActivity'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-full md:max-w-sm bg-discord-black-70 rounded-lg shadow-xl p-6 flex flex-col gap-6">
            <div>
                <label for="createVcChannelName" className="block mb-2 text-sm font-medium">Create VC Channel Name</label>
                <input type="text" id="createVcChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="Create VC" required />
            </div>
            <div>
                <label for="inVoiceChannelName" className="block mb-2 text-sm font-medium">In Voice Channel Name</label>
                <input type="text" id="inVoiceChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="In Voice" required />
            </div>
            <div>
                <label for="memberCountChannelName" className="block mb-2 text-sm font-medium">Member Count Channel Name</label>
                <input type="text" id="memberCountChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="Members" required />
            </div>
        </section>
    );
}
