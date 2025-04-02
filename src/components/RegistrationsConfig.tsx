import { useState } from 'preact/hooks';
import { AnimatePresence, motion } from 'motion/react';
import { i18n } from '@lingui/core';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { SupabaseGuildConfig } from '../clients/supabase';
import Tabs from './Tabs';
import { DiscordGuild } from '../clients/discord';
import { putRegistration } from '../clients/api';

interface RegistrationMessageConfigProps {
    registration: {
        dm_registered_title: string;
        dm_registered_body: string;
        dm_registered_footer?: string | null;
    } & Record<string, unknown>;
    onChange: (field: string, value: string) => void;
}

const RegistrationMessageConfig = (props: RegistrationMessageConfigProps) => {
    const onFieldChange = (field: string) => (event) => {
        props.onChange(field, event.currentTarget.value);
    };

    return (
        <div>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
                <textarea
                    value={props.registration.dm_registered_title}
                    onChange={onFieldChange('dm_registered_title')}
                    placeholder={i18n.t('Title')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_registered_body}
                    onChange={onFieldChange('dm_registered_body')}
                    placeholder={i18n.t('Body')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_registered_footer || ''}
                    onChange={onFieldChange('dm_registered_footer')}
                    placeholder={i18n.t('Footer')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
            </div>
        </div>
    );
};

interface ApprovalMessageConfigProps {
    registration: {
        dm_approval_title: string;
        dm_approval_body: string;
        dm_approval_footer?: string | null;
    } & Record<string, unknown>;
    onChange: (field: string, value: string) => void;
}

const ApprovalMessageConfig = (props: ApprovalMessageConfigProps) => {
    const onFieldChange = (field: string) => (event) => {
        props.onChange(field, event.currentTarget.value);
    };

    return (
        <div>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
                <textarea
                    value={props.registration.dm_approval_title}
                    onChange={onFieldChange('dm_approval_title')}
                    placeholder={i18n.t('Title')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_approval_body}
                    onChange={onFieldChange('dm_approval_body')}
                    placeholder={i18n.t('Body')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_approval_footer || ''}
                    onChange={onFieldChange('dm_approval_footer')}
                    placeholder={i18n.t('Footer')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
            </div>
        </div>
    );
};

interface DelayMessageConfigProps {
    registration: {
        dm_delay_title: string;
        dm_delay_body: string;
        dm_delay_footer?: string | null;
    } & Record<string, unknown>;
    onChange: (field: string, value: string) => void;
}

const DelayMessageConfig = (props: DelayMessageConfigProps) => {
    const onFieldChange = (field: string) => (event) => {
        props.onChange(field, event.currentTarget.value);
    };

    return (
        <div>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
                <textarea
                    value={props.registration.dm_delay_title}
                    onChange={onFieldChange('dm_delay_title')}
                    placeholder={i18n.t('Title')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_delay_body}
                    onChange={onFieldChange('dm_delay_body')}
                    placeholder={i18n.t('Body')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
                <textarea
                    value={props.registration.dm_delay_footer || ''}
                    onChange={onFieldChange('dm_delay_footer')}
                    placeholder={i18n.t('Footer')}
                    className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                />
            </div>
        </div>
    );
};

interface RegistrationProps {
    guildId: DiscordGuild['id'];
    registration: NonNullable<SupabaseGuildConfig['registration']>[number];
}

const Registration = (props: RegistrationProps) => {
    const [data, setData] = useState(props.registration);
    const [fields, setFields] = useState(props.registration.fields.reduce((acc, field) => {
        const id = self.crypto.randomUUID();
        return { ...acc, [id]: { ...field, id } };
    }, {} as Record<string, RegistrationProps['registration']['fields'][number] & { id: string; }>));
    const [open, setOpen] = useState(true);

    const onRootFieldChange = (field: string, value: unknown) => {
        setData((data) => ({
            ...data,
            [field]: value,
        }));
    };

    const directMessageTabs = [
        {
            name: 'Sent',
            render: <RegistrationMessageConfig registration={data} onChange={onRootFieldChange} />
        },
        {
            name: 'Approved',
            render: <ApprovalMessageConfig registration={data} onChange={onRootFieldChange} />
        },
        {
            name: 'Delayed',
            render: <DelayMessageConfig registration={data} onChange={onRootFieldChange} />
        },
    ];

    const toggle = () => {
        setOpen((open) => !open);
    };

    const onAddFieldClick = () => {
        setFields((fields) => {
            const id = self.crypto.randomUUID();
            return {
                ...fields,
                [id]: { id, field_title: '' },
            };
        });
    };

    const onSaveClick = async () => {
        const payload = {
            ...data,
            fields: Object.values(fields).map((field) => ({ field_title: field.field_title })),
        };

        toast.promise(putRegistration(props.guildId, payload), {
            loading: i18n.t('Syncing config...'),
            success: i18n.t('Config synced!'),
            error: i18n.t('Sync failed!'),
        });
    };

    const onGameNameChange = (event) => setData((data) => ({
        ...data,
        game_name: event.currentTarget.value,
    }));

    const onFieldChange = (fieldId: string) => (event) => {
        if (!(fieldId in fields)) return;
        setFields((fields) => ({
            ...fields,
            [fieldId]: {
                ...fields[fieldId],
                field_title: event.currentTarget.value,
            },
        }));
    };

    return (
        <section className="bg-discord-black-80 rounded-lg shadow-xl py-6">
            <div className="w-full flex px-6">
                <input
                    value={data.game_name}
                    onChange={onGameNameChange}
                    placeholder={i18n.t('Untitled')}
                    className="bg-discord-black-70 text-sm rounded-lg block p-2.5"
                />
                <div className="ml-4 w-full flex gap-4 items-center">
                    <button onClick={toggle} className="ml-auto cursor-pointer">
                        <Icon className="text-infinitea-orange" icon={open ? "solar:eye-bold" : "solar:eye-closed-bold"} width="24" height="24" />
                    </button>
                    <button
                        onClick={onSaveClick}
                        className="justify-center rounded-lg text-black bg-infinitea-orange px-3 py-1.5 font-semibold shadow transition hover:scale-103 active:scale-97"
                    >
                        Save
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="overflow-y-hidden flex flex-col gap-6"
                        initial={{ height: 0, marginTop: 0 }}
                        animate={{ height: 'auto', marginTop: 'calc(var(--spacing) * 6)' }}
                        exit={{ height: 0, marginTop: 0 }}
                    >
                        <div className="px-6">
                            <h2 className="text-xl font-semibold mb-2">{i18n.t('Application Fields')}</h2>
                            <p className="text-sm text-gray-400/75">{i18n.t('Define the fields the user must input when registering through this flow.')}</p>
                            {Object.keys(fields).length > 0 && (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                                    {Object.values(fields).map((field) => (
                                        <input
                                            value={field.field_title}
                                            onChange={onFieldChange(field.id)}
                                            placeholder={i18n.t('Field')}
                                            className="bg-discord-black-70 text-sm rounded-lg block w-full p-2.5"
                                        />
                                    ))}
                                </ul>
                            )}
                            <button
                                onClick={onAddFieldClick}
                                className="mt-6 justify-center rounded-lg border-2 border-infinitea-orange px-3 py-1.5 font-semibold shadow transition hover:scale-103 active:scale-97"
                            >
                                {i18n.t('Add Field')}
                            </button>
                        </div>
                        <hr className="h-[2px] bg-discord-black-70 border-0" />
                        <div>
                            <h2 className="px-6 text-xl font-semibold mb-2">{i18n.t('Status Update Messages')}</h2>
                            <p className="px-6 text-sm text-gray-400/75 mb-2">{i18n.t('When a registration application is submitted or has its status updated, its respective message will be sent to the registrant.')}</p>
                            <Tabs tabs={directMessageTabs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

interface Props {
    guildId: DiscordGuild['id'];
    config: SupabaseGuildConfig['registration'];
}

export default (props: Props) => {
    const [registrations, setRegistrations] = useState(props.config || []);

    const onAddRegistration = () => {
        setRegistrations((registrations) => [
            ...registrations,
            {
                fields: [],
            } as any // TODO: remove this any
        ]);
    };

    return (
        <div>
            {registrations.length > 0 && (
                <div className="flex flex-col gap-6">
                    {registrations.map((registration) => (
                        <Registration guildId={props.guildId} registration={registration} />
                    ))}
                </div>
            )}
            {!registrations.length && (
                <div className="">{i18n.t('Join Quests allow your players to join a community or game server by completing a registration form.')}</div>
            )}
            <button
                onClick={onAddRegistration}
                className="mt-6 text-black justify-center rounded-lg bg-infinitea-orange px-3 py-1.5 font-semibold shadow transition hover:scale-103 active:scale-97">
                {i18n.t('Create Join Quest')}
            </button>
        </div>
    );
}
