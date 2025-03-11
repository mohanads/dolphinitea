import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['amp'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-full md:max-w-sm bg-discord-black-70 rounded-lg px-6 py-4 flex flex-col gap-4">
            <div>
                <label for="controllerUrl" className="block mb-2 text-sm font-medium">Controller URL</label>
                <input type="url" id="controllerUrl" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="https://example.io" required />
            </div>
            <div>
                <label for="botUsername" className="block mb-2 text-sm font-medium">Bot Username</label>
                <input type="text" id="botUsername" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="*******" required />
            </div>
            <div>
                <label for="botPassword" className="block mb-2 text-sm font-medium">Bot Password</label>
                <input type="text" id="botPassword" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="infiniti-rw" required />
            </div>
        </section>
    );
}
