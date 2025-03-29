import { h } from 'preact';
import Router from 'preact-router';
import '../index.css';
import { State, IState, createState } from '../state';
import * as Pages from '../pages';
import { ToastContainer } from 'react-toastify';

export const pages = [
    {
        route: '/',
        Component: Pages.Home
    },
    {
        route: '/privacy',
        Component: Pages.PrivacyPolicy,
    },
    {
        route: '/terms',
        Component: Pages.TermsAndConditions,
    },
    {
        route: '/oauth2',
        Component: Pages.OAuth,
    },
    {
        route: '/guilds',
        Component: Pages.Guilds,
    },
    {
        route: '/guilds/:id',
        Component: Pages.Guild,
    },
];

interface Props {
    state?: IState;
    url?: string;
}

export default (props: Props) => {
    const state = createState(props.state);

    return (
        <State.Provider value={state}>
            <ToastContainer position='bottom-center' theme='dark' autoClose={2000} stacked />
            {state.error && <Pages.Error />}
            {state.unauthorized && <Pages.Unauthorized />}
            {!state.error && !state.unauthorized && (
                <Router url={props.url}>
                    {/* @ts-ignore // TODO: fix the `path` type error */}
                    {pages.map(page => <page.Component path={page.route} />)}
                </Router>
            )}
        </State.Provider>
    );
};
