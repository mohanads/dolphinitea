import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['starboard'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-full md:max-w-sm bg-discord-black-70 rounded-lg shadow-xl p-6 flex flex-col gap-4">
            <div>
                <label for="channelName" className="block mb-2 text-sm font-medium">Channel Name</label>
                <input type="text" id="channelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="Starboard" required />
            </div>
            <div>
                <label for="reaction" className="block mb-2 text-sm font-medium">Reaction</label>
                <input type="text" id="reaction" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="⭐️" required />
            </div>
            <div>
                <label for="requiredReactions" className="block mb-2 text-sm font-medium">Required Reactions</label>
                <input type="number" id="requiredReactions" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="10" required />
            </div>
        </section>
    );
}
