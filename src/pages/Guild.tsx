import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { IState, State } from '../state';
import Layout from '../components/Layout';
import AMPConfig from '../components/AMPConfig';
import { i18n } from '@lingui/core';
import FeatureFlagsConfig from '../components/FeatureFlagsConfig';
import POE2Config from '../components/POE2Config';
import StarboardConfig from '../components/StarboardConfig';

enum Tab {
    AMP = 'AMP',
    STARBOARD = 'Starboard',
    POE2 = 'PoE 2',
    FEATURE_FLAGS = 'Feature Flags',
    MEMBER_ACTIVITY = 'Member Activity',
}

const TabContent = (props: { tab: Tab | undefined, config: IState['guildConfig'] | undefined }) => {
    if (!props.config) {
        return (
            <h2>
                There aren't any configs available for this Guild, yet. Please check back later.
                If you think this is incorrect, please let us know.
            </h2>
        );
    }

    switch (props.tab) {
        case Tab.AMP:
            return <AMPConfig config={props.config.amp} />;
        case Tab.FEATURE_FLAGS:
            return <FeatureFlagsConfig config={props.config.featureFlags} />;
        case Tab.POE2:
            return <POE2Config config={props.config.poe2Registration} />;
        case Tab.STARBOARD:
            return <StarboardConfig config={props.config.starboard} />;
        default:
            return null as never;
    }
};

export default () => {
    const state = useContext(State);
    const disabled = {
        [Tab.AMP]: !Boolean(state.guildConfig?.amp),
        [Tab.STARBOARD]: !Boolean(state.guildConfig?.starboard),
        [Tab.POE2]: !Boolean(state.guildConfig?.poe2Registration),
        [Tab.FEATURE_FLAGS]: !Boolean(state.guildConfig?.featureFlags),
        [Tab.MEMBER_ACTIVITY]: !Boolean(state.guildConfig?.memberActivity),
    } as const satisfies Record<Tab, boolean>;
    const firstEnabledTab = Object.keys(disabled).find((tab) => !disabled[tab]) as Tab | undefined;
    const [activeTab, setActiveTab] = useState<Tab | undefined>(firstEnabledTab);

    const activateTab = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <nav className="bg-white text-sm font-medium text-center text-gray-600 shadow">
                <div className="container px-6 mx-auto flex-grow flex flex-col overflow-auto no-scrollbar">
                    <ul className="flex gap-2">
                        {Object.values(Tab).map((tab) => (
                            <li>
                                <button
                                    disabled={disabled[tab]}
                                    onClick={() => !disabled[tab] && activateTab(tab)}
                                    type="button"
                                    className={`whitespace-nowrap p-4 transition border-b-2 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ${tab !== activeTab ? 'border-transparent hover:border-gray-600' : 'text-blue-600! active border-blue-600'}`}
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
                    <TabContent tab={activeTab} config={state.guildConfig} />
                </div>
            </div>
        </Layout>
    );
};
