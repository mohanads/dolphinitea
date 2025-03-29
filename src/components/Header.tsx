import { useContext } from 'preact/hooks';
import { State } from '../state';
import { i18n } from '@lingui/core';

export default () => {
    const state = useContext(State);

    const onLogoutClick = async () => {
        await fetch('/logout', { method: 'PUT' });
        window.location.assign('/');
    };

    return (
        <header className='bg-discord-black-90 border-b-2 border-discord-black-80 shadow-xl'>
            <nav className='container flex flex-wrap items-center justify-between mx-auto px-6 py-4'>
                <a
                    href={state.user ? '/guilds' : '/'}
                    className='flex items-center space-x-2 rtl:space-x-reverse'
                >
                    <img className="h-4" src="/public/infinitea.svg" />
                    <span className='self-center text-2xl whitespace-nowrap'>
                        InfiniTea
                    </span>
                </a>
                {state.user && (
                    <div className='flex ml-auto'>
                        <button className='underline' onClick={onLogoutClick}>{i18n.t('Logout')}</button>
                    </div>
                )}
            </nav>
        </header>
    );
};
