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
import { DiscordGuild } from '../clients/discord';

enum Tab {
    FeatureFlags = 'Feature Flags',
    MemberActivity = 'Member Activity',
    Starboard = 'Starboard',
    PoE2 = 'PoE 2',
    AMP = 'AMP',
}

const TabContent = (props: { guildId: string; tab: Tab | undefined, config: IState['guildConfig'] | undefined }) => {
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
        case Tab.FeatureFlags:
            return <FeatureFlagsConfig guildId={props.guildId} config={props.config.featureFlags} />;
        case Tab.PoE2:
            return <POE2Config config={props.config.poe2Registration} />;
        case Tab.Starboard:
            return <StarboardConfig config={props.config.starboard} />;
        case Tab.MemberActivity:
            return <MemberActivityConfig config={props.config.memberActivity} />;
        default:
            return null as never;
    }
};

interface Props {
    id: DiscordGuild['id'];
}

export default (props: Props) => {
    const state = useContext(State);
    const hasConfig = {
        [Tab.FeatureFlags]: Boolean(state.guildConfig?.featureFlags),
        [Tab.MemberActivity]: Boolean(state.guildConfig?.memberActivity),
        [Tab.Starboard]: Boolean(state.guildConfig?.starboard),
        [Tab.PoE2]: Boolean(state.guildConfig?.poe2Registration),
        [Tab.AMP]: Boolean(state.guildConfig?.amp),
    };
    const killSwitch = {
        [Tab.FeatureFlags]: Boolean(state.featureFlags!['feature-flags-config-kill-switch']),
        [Tab.MemberActivity]: Boolean(state.featureFlags!['member-activity-kill-switch']),
        [Tab.Starboard]: Boolean(state.featureFlags!['starboard-config-kill-switch']),
        [Tab.PoE2]: Boolean(state.featureFlags!['poe2-config-kill-switch']),
        [Tab.AMP]: Boolean(state.featureFlags!['amp-config-kill-switch']),
    };
    const disabled = Object.values(Tab).reduce((acc, tab) => ({
        ...acc,
        [tab]: !hasConfig[tab] || killSwitch[tab]
    }), {}) as Record<Tab, boolean>;
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
                        <div className='flex gap-4'>
                            {/* TODO: display missing img placeholder */}
                            {state.guild!.icon && (
                                <img className='size-20 rounded'
                                    src={`https://cdn.discordapp.com/icons/${state.guild!.id}/${state.guild!.icon}.png`}
                                />
                            )}
                            <div className='flex flex-col'>
                                <h1 className="text-2xl font-semibold mb-2">{i18n.t('Configure your Guild')}</h1>
                                <h2 className="text-xl">{state.guild!.name}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <TabContent guildId={props.id} tab={activeTab} config={state.guildConfig} />
            </div>
        </Layout>
    );
};
