import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['starboard'];
}

export default (props: Props) => {
    return (
        <section className="block max-w-sm bg-white border border-gray-200 rounded-lg">
            <div className="p-6 pb-3">
                <h2 className="text-lg font-medium tracking-tight">Starboard</h2>
            </div>
            <hr className="bg-gray-200 border-0 h-px" />
            <div className="p-6 pt-3 flex flex-col gap-4">
            </div>
        </section>
    );
}
