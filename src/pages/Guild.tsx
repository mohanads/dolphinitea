import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { State } from '../state';
import Layout from '../components/Layout';
import AMPConfig from '../components/AMPConfig';
import { i18n } from '@lingui/core';

enum Tab {
    AMP = 'AMP',
    STARBOARD = 'Starboard',
    POE2 = 'PoE 2',
    FEATURE_FLAGS = 'Feature Flags',
}

export default () => {
    const state = useContext(State);
    const [activeTab, setActiveTab] = useState<Tab>(Tab.AMP);

    const activateTab = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <nav className="bg-white text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                <div className="container px-6 mx-auto flex-grow flex flex-col">
                    <ul className="flex flex-wrap gap-6">
                        {Object.values(Tab).map((tab) => (
                            <li>
                                <button
                                    onClick={() => activateTab(tab)}
                                    type="button"
                                    className={`py-4 hover:text-gray-600 ${tab !== activeTab ? '' : 'text-blue-600 active'}`}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto px-6 py-4 flex-grow flex flex-col">
                <div className="mb-4">
                    <div className="flex justify-between items-center gap-2">
                        <h1 className='text-2xl font-semibold mb-2'>{i18n.t('Configure your Guild')}</h1>
                        {state.guild && (
                            <div className='flex'>
                                {/* TODO: display missing img placeholder */}
                                {state.guild.icon && (
                                    <img
                                        className='size-6 rounded mr-4'
                                        src={`https://cdn.discordapp.com/icons/${state.guild.id}/${state.guild.icon}.png`}
                                    ></img>
                                )}
                                <div className='flex-auto min-w-0 h-min overflow-hidden tracking-tight text-gray-900 text-left truncate'>
                                    {state.guild.name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    {state.guildConfig?.amp && (
                        <AMPConfig config={state.guildConfig.amp} />
                    )}
                </div>
            </div>
        </Layout>
    );
};
