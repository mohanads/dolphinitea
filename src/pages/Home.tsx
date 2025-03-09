import { h } from 'preact';
import Layout from '../components/Layout';
import { route } from 'preact-router';

export default () => {
    const onAuthClick = () => {
        window.addEventListener('message', function (event) {
            if (event.data.type === 'oauth2') {
                route('/guilds');
            }
        }, { once: true });

        window.open(process.env.DISCORD_AUTH_LINK, '_blank', 'width=600,height=900');
    };

    return (
        <Layout>
            <div className="container mx-auto px-6 py-4 flex-grow flex flex-col">
                <div className="m-auto">
                    <button
                        onClick={onAuthClick}
                        className="flex rounded-lg transition bg-blue-500 px-3 py-2 font-semibold text-white hover:scale-103 active:scale-97">
                        <img className="h-7 text-white" src="/public/discord.svg" />
                        <span className="ml-2">
                            Login with Discord
                        </span>
                    </button>
                </div>
            </div>
        </Layout>
    );
};
