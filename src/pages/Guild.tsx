import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { i18n } from '@lingui/core';
import { IState, State } from '../state';
import Layout from '../components/Layout';
import AMPConfig from '../components/AMPConfig';
import FeatureFlagsConfig from '../components/FeatureFlagsConfig';
import StarboardConfig from '../components/StarboardConfig';
import MemberActivityConfig from '../components/MemberActivityConfig';
import RegistrationsConfig from '../components/RegistrationsConfig';
import { DiscordGuild } from '../clients/discord';

enum Tab {
    FeatureFlags = 'Feature Flags',
    MemberActivity = 'Member Activity',
    Starboard = 'Starboard',
    AMP = 'AMP',
    JoinQuests = 'Join Quests',
}

const TabContent = (props: { guildId: string; tab: Tab, config?: IState['guildConfig'] }) => {
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
        case Tab.Starboard:
            return <StarboardConfig config={props.config.starboard} />;
        case Tab.MemberActivity:
            return <MemberActivityConfig config={props.config.memberActivity} />;
        case Tab.JoinQuests:
            return <RegistrationsConfig guildId={props.guildId} config={props.config.registration} />;
        default:
            return null as never;
    }
};

interface Props {
    id: DiscordGuild['id'];
}

export default (props: Props) => {
    const state = useContext(State);
    const tabs: { id: Tab, name: string, disabled: boolean }[] = [
        {
            id: Tab.FeatureFlags,
            name: i18n.t('Feature Flags'),
            disabled: !Boolean(state.guildConfig?.featureFlags) || Boolean(state.featureFlags!['feature-flags-config-kill-switch']),
        },
        {
            id: Tab.MemberActivity,
            name: i18n.t('Member Activity'),
            disabled: !Boolean(state.guildConfig?.memberActivity) || Boolean(state.featureFlags!['member-activity-kill-switch']),
        },
        {
            id: Tab.Starboard,
            name: i18n.t('Starboard'),
            disabled: !Boolean(state.guildConfig?.starboard) || Boolean(state.featureFlags!['starboard-config-kill-switch']),
        },
        {
            id: Tab.AMP,
            name: i18n.t('AMP'),
            disabled: !Boolean(state.guildConfig?.amp) || Boolean(state.featureFlags!['amp-config-kill-switch']),
        },
        {
            id: Tab.JoinQuests,
            name: i18n.t('Join Quests'),
            disabled: !Boolean(state.guildConfig?.registration),
        },
    ];
    const firstEnabledTab = tabs.find((tab) => !tab.disabled);
    const [activeTab, setActiveTab] = useState<Tab | undefined>(firstEnabledTab?.id);

    const activateTab = (tab: Tab) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <nav className="bg-discord-black-90 z-1 border-b-2 border-discord-black-80 text-sm font-medium text-center shadow-xl">
                <div className="container px-6 mx-auto flex-grow flex flex-col overflow-auto no-scrollbar">
                    <ul className="flex gap-6">
                        {tabs.map((tab) => (
                            <li>
                                <button
                                    disabled={tab.disabled}
                                    onClick={() => !tab.disabled && activateTab(tab.id)}
                                    type="button"
                                    className={`
                                        whitespace-nowrap py-4 transition border-b-2 disabled:text-gray-400
                                        disabled:cursor-not-allowed disabled:border-transparent
                                        ${tab.id !== activeTab ? 'border-transparent hover:border-discord-black-60' : 'text-infinitea-orange! active border-infinitea-orange'}`}
                                >
                                    {i18n.t(tab)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto px-6 py-6 flex flex-col">
                <div className="mb-6">
                    <div className="flex justify-between items-center gap-6">
                        <div className='flex gap-6'>
                            {/* TODO: display missing img placeholder */}
                            {state.guild.icon && (
                                <img className='size-20 rounded'
                                    src={`https://cdn.discordapp.com/icons/${state.guild.id}/${state.guild.icon}.png`}
                                />
                            )}
                            <div className='flex flex-col'>
                                <h1 className="text-2xl font-semibold mb-2">{i18n.t('Configure your Guild')}</h1>
                                <h2 className="text-lg text-gray-400/75">{state.guild.name}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                {activeTab && <TabContent guildId={props.id} tab={activeTab} config={state.guildConfig} />}
            </div>
        </Layout>
    );
};
