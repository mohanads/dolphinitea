import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['poe2Registration'];
}

export default (props: Props) => {
    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <section className="block max-w-full bg-discord-black-70 rounded-lg py-6 flex flex-col gap-4">
                <div className="px-6">
                    <h2 className="text-xl">Channel</h2>
                </div>
                <hr className="h-[2px] bg-discord-black-60 border-0" />
                <div className="px-6 flex flex-col gap-4">
                    <div>
                        <label for="channelEmbedTitle" className="block mb-2 text-sm font-medium">Channel Embed Title</label>
                        <input type="text" id="channelEmbedTitle" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div>
                        <label for="channelEmbedMessage" className="block mb-2 text-sm font-medium">Channel Embed Message</label>
                        <input type="text" id="channelEmbedMessage" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div>
                        <label for="channelEmbedFooter" className="block mb-2 text-sm font-medium">Channel Embed Footer</label>
                        <input type="text" id="channelEmbedFooter" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                    <div>
                        <label for="channelUrl" className="block mb-2 text-sm font-medium">Channel URL</label>
                        <input type="text" id="channelUrl" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" required />
                    </div>
                </div>
            </section>
            <section className="block max-w-full bg-discord-black-70 rounded-lg py-6 flex flex-col gap-4">
                <div className="px-6">
                    <h2 className="text-xl">Approval</h2>
                </div>
                <hr className="h-[2px] bg-discord-black-60 border-0" />
                <div className="px-6 flex flex-col gap-4">
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
                </div>
            </section>
            <section className="block max-w-full bg-discord-black-70 rounded-lg py-6 flex flex-col gap-4">
                <div className="px-6">
                    <h2 className="text-xl">Delay</h2>
                </div>
                <hr className="h-[2px] bg-discord-black-60 border-0" />
                <div className="px-6 flex flex-col gap-4">
                    <div>
                        <label for="createVcChannelName" className="block mb-2 text-sm font-medium">Create VC Channel Name</label>
                        <input type="text" id="createVcChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="Create VC" required />
                    </div>
                    <div>
                        <label for="inVoiceChannelName" className="block mb-2 text-sm font-medium">In Voice Channel Name</label>
                        <input type="text" id="inVoiceChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="In Voice" required />
                    </div>
                </div>
            </section>
            <section className="block max-w-full bg-discord-black-70 rounded-lg py-6 flex flex-col gap-4">
                <div className="px-6">
                    <h2 className="text-xl">Other</h2>
                </div>
                <hr className="h-[2px] bg-discord-black-60 border-0" />
                <div className="px-6 flex flex-col gap-4">
                    <div>
                        <label for="memberCountChannelName" className="block mb-2 text-sm font-medium">Member Count Channel Name</label>
                        <input type="text" id="memberCountChannelName" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="Members" required />
                    </div>
                </div>
            </section>
        </div>
    );
}
