import { useState } from 'preact/hooks';
import { type JSX } from 'preact/jsx-runtime';

interface Tab<Name> {
    name: Name;
    render: JSX.Element;
    disabled?: boolean;
}

interface Props<Name> {
    tabs: Tab<Name>[]
}

export default function <Name extends string>(props: Props<Name>) {
    const firstEnabledTabName = props.tabs.find((tab) => !tab.disabled)?.name;
    const [activeTabName, setActiveTabName] = useState(firstEnabledTabName);

    const activateTab = (name: Name) => {
        setActiveTabName(name);
    };

    return (
        <section>
            <nav className="overflow-auto no-scrollbar border-b-2 border-discord-black-70 px-6">
                <ul className="flex gap-6 text-sm">
                    {props.tabs.filter(({ disabled }) => !disabled).map((tab) => (
                        <li>
                            <button
                                onClick={() => activateTab(tab.name)}
                                type="button"
                                className={`whitespace-nowrap py-4 transition disabled:text-gray-400 disabled:cursor-not-allowed disabled border-b-2 ${tab.name !== activeTabName ? 'border-transparent hover:border-discord-black-60' : 'text-infinitea-orange! active border-infinitea-orange'}`}
                            >
                                {tab.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-6 pb-0">
                {props.tabs.find(({ name }) => name === activeTabName)?.render}
            </div>
        </section>
    );
}
