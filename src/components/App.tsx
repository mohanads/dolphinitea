import { h } from 'preact';
import Router from 'preact-router';
import '../index.css';
import { State, IState, createState } from '../state';
import Home from '../pages/Home';
import OAuth from '../pages/OAuth';
import Guilds from '../pages/Guilds';
import Guild from '../pages/Guild';

export const pages = [
    {
        route: '/',
        Component: Home
    },
    {
        route: '/oauth2',
        Component: OAuth,
    },
    {
        route: '/guilds',
        Component: Guilds,
    },
    {
        route: '/guilds/:id',
        Component: Guild,
    }
];

interface Props {
    state?: IState;
    url?: string;
}

export default (props: Props) => {
    return (
        <State.Provider value={createState(props.state)}>
            <Router url={props.url}>
                {/* @ts-ignore // TODO: fix the `path` type error */}
                {pages.map(page => <page.Component path={page.route} />)}
            </Router>
        </State.Provider>
    );
};
