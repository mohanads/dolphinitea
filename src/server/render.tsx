import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import HtmlTemplate from '../components/HtmlTemplate';
import App from '../components/App';
import { type IState } from '../state';

const envVars: Record<string, string | number | boolean> = [
    'DISCORD_AUTH_LINK',
    'DISCORD_INVITE_LINK',
    'GITHUB_LINK',
].reduce((env, envVar) => {
    env[envVar] = process.env[envVar];
    return env;
}, {});

export default function render(data: IState, url: string) {
    return renderToString(
        <HtmlTemplate envVars={envVars} state={data}>
            <App url={url} state={data} />
        </HtmlTemplate>
    );
}
