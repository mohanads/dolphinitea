import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { IState, State } from '../state';
import Layout from '../components/Layout';
import AMPConfig from '../components/AMPConfig';
import { i18n } from '@lingui/core';
import FeatureFlagsConfig from '../components/FeatureFlagsConfig';
import POE2Config from '../components/POE2Config';
import StarboardConfig from '../components/StarboardConfig';
import MemberActivityConfig from '../components/MemberActivityConfig';

enum Tab {
    FEATURE_FLAGS = 'Feature Flags',
    MEMBER_ACTIVITY = 'Member Activity',
    STARBOARD = 'Starboard',
    POE2 = 'PoE 2',
    AMP = 'AMP',
}

const TabContent = (props: { tab: Tab | undefined, config: IState['guildConfig'] | undefined }) => {
    if (!props.config) {
        return (
            <h2>
                <div>There aren't any configs available for this Guild, yet. Please check back later.</div>
                <div>If you think this is incorrect, please let us know.</div>
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
        case Tab.MEMBER_ACTIVITY:
            return <MemberActivityConfig config={props.config.memberActivity} />;
        default:
            return null as never;
    }
};

export default () => {
    const state = useContext(State);
    const disabled = {
        [Tab.FEATURE_FLAGS]: !Boolean(state.guildConfig?.featureFlags),
        [Tab.MEMBER_ACTIVITY]: !Boolean(state.guildConfig?.memberActivity),
        [Tab.STARBOARD]: !Boolean(state.guildConfig?.starboard),
        [Tab.POE2]: !Boolean(state.guildConfig?.poe2Registration),
        [Tab.AMP]: !Boolean(state.guildConfig?.amp),
    } as const satisfies Record<Tab, boolean>;
    const firstEnabledTab = Object.keys(disabled).find((tab) => !disabled[tab]) as Tab | undefined;
    const [activeTab, setActiveTab] = useState<Tab | undefined>(firstEnabledTab);

    const activateTab = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <nav className="bg-discord-black-90 z-1 border-b-2 border-discord-black-60 text-sm font-medium text-center shadow-xl shadow-white/3">
                <div className="container px-6 mx-auto flex-grow flex flex-col overflow-auto no-scrollbar">
                    <ul className="flex gap-6">
                        {Object.values(Tab).map((tab) => (
                            <li>
                                <button
                                    disabled={disabled[tab]}
                                    onClick={() => !disabled[tab] && activateTab(tab)}
                                    type="button"
                                    className={`
                                        whitespace-nowrap py-4 transition border-b-2 disabled:text-gray-400
                                        disabled:cursor-not-allowed disabled:border-transparent
                                        ${tab !== activeTab ? 'border-transparent hover:border-discord-black-60' : 'text-infinitea-orange! active border-infinitea-orange'}`}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto px-6 py-6 flex flex-col">
                <div className="mb-4">
                    <div className="flex justify-between items-center gap-2">
                        <h1 className='text-2xl font-semibold mb-2'>
                            {state.guild ? (
                                <div className='flex gap-4'>
                                    {/* TODO: display missing img placeholder */}
                                    {state.guild.icon && (
                                        <img className='size-20 rounded'
                                            src={`https://cdn.discordapp.com/icons/${state.guild.id}/${state.guild.icon}.png`}
                                        />
                                    )}
                                    <div className='flex flex-col gap-2'>
                                        <div>{i18n.t('Configure')}</div>
                                        <select id="countries" className="bg-discord-black-60 border border-infinitea-orange text-sm rounded-lg block w-full px-2.5 py-2">
                                            <option selected>
                                                {state.guild.name}
                                            </option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="FR">France</option>
                                            <option value="DE">Germany</option>
                                        </select>
                                    </div>
                                </div>
                            ) : i18n.t('Configure your Guild')}
                        </h1>
                    </div>
                </div>
                <TabContent tab={activeTab} config={state.guildConfig} />
            </div>
        </Layout>
    );
};
