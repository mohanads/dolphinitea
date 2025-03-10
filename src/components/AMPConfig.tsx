import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['amp'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-full md:max-w-sm bg-[#36393e] rounded-lg">
            <div className="p-6 pb-3">
                <h2 className="text-lg font-medium tracking-tight">AMP (Server)</h2>
            </div>
            <hr className="bg-[#282b30] border-0 h-[2px]" />
            <div className="p-6 pt-3 flex flex-col gap-4">
                <div>
                    <label for="controllerUrl" className="block mb-2 text-sm font-medium">Controller URL</label>
                    <input type="url" id="controllerUrl" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="https://example.io" required />
                </div>
                <div>
                    <label for="botUsername" className="block mb-2 text-sm font-medium">Bot Username</label>
                    <input type="text" id="botUsername" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
                </div>
                <div>
                    <label for="botPassword" className="block mb-2 text-sm font-medium">Bot Password</label>
                    <input type="text" id="botPassword" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="infiniti-rw" required />
                </div>
            </div>
        </section>
    );
}
