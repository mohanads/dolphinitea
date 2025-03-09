import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['amp'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-full md:max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            <div className="p-6 pb-3">
                <h2 className="text-lg font-medium tracking-tight text-gray-900">AMP (Server)</h2>
            </div>
            <hr className="bg-gray-200 border-0 h-px" />
            <div className="p-6 pt-3 flex flex-col gap-4">
                <div>
                    <label for="controllerUrl" className="block mb-2 text-sm font-medium text-gray-900">Controller URL</label>
                    <input type="url" id="controllerUrl" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="https://example.io" required />
                </div>
                <div>
                    <label for="botUsername" className="block mb-2 text-sm font-medium text-gray-900">Bot Username</label>
                    <input type="text" id="botUsername" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="*******" required />
                </div>
                <div>
                    <label for="botPassword" className="block mb-2 text-sm font-medium text-gray-900">Bot Password</label>
                    <input type="text" id="botPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="infiniti-rw" required />
                </div>
            </div>
        </section>
    );
}
