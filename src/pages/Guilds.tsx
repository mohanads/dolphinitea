import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { State } from '../state';
import { DiscordGuild } from '../clients/discord';
import Layout from '../components/Layout';
import GuildButton from '../components/GuildButton';
import { i18n } from '@lingui/core';

export default () => {
    const state = useContext(State);

    const onGuildClick = (guild: DiscordGuild) => {
        window.location.assign(`/guilds/${guild.id}`);
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 flex-grow flex flex-col">
                <h1 className='text-2xl font-semibold mb-6'>{i18n.t('Select a Guild')}</h1>
                {state.displayGuilds?.length ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {state.displayGuilds.map((guild) => (
                            <GuildButton guild={guild} onClick={onGuildClick} />
                        ))}
                    </div>
                ) : (
                    <div>
                        {i18n.t(`Servers you've joined will show up here. If your server isn't listed, please let us know.`)}
                    </div>
                )}
            </div>
        </Layout>
    );
};
