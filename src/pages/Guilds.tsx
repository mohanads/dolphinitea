import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { State } from '../state';
import { DiscordGuild } from '../clients/discord';
import Layout from '../components/Layout';
import GuildButton from '../components/GuildButton';

export default () => {
    const state = useContext(State);

    const onGuildClick = (guild: DiscordGuild) => {
        window.location.assign(`/guilds/${guild.id}`);
    };

    return (
        <Layout>
            <div className="container mx-auto px-6 py-4 flex-grow flex flex-col">
                <h1 className='text-2xl font-semibold mb-4'>Select a Guild</h1>
                {state.guilds?.length ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {state.guilds.map((guild) => (
                            <GuildButton guild={guild} onClick={onGuildClick} />
                        ))}
                    </div>
                ) : (
                    <div>
                        Servers you've joined will show up here. If your server
                        isn't listed, please let us know.
                    </div>
                )}
            </div>
        </Layout>
    );
};
