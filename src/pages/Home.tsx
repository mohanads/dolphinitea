import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Footer from '../components/Footer';
import { Gradient } from '../gradient';

export default () => {
    const onAuthClick = () => {
        window.addEventListener('message', function (event) {
            if (event.data.type === 'oauth2') {
                window.location.assign('/guilds');
            }
        }, { once: true });

        const popupWidth = 600;
        const popupHeight = 900;
        const popupTop = (screen.height - popupHeight) / 2;
        const popupLeft = (screen.width - popupWidth) / 2;
        let windowFeatures = `width=${popupWidth},height=${popupHeight}`;

        if (popupTop != null && popupLeft != null) {
            windowFeatures += `,top=${popupTop},left=${popupLeft}`;
        }

        window.open(process.env.DISCORD_AUTH_LINK, '_blank', windowFeatures);
    };

    useEffect(() => {
        new Gradient().initGradient('#gradient-canvas');
    }, []);

    return (
        <main className="min-h-screen bg-discord-black-80 flex flex-col">
            <div className="min-h-screen flex flex-col relative">
                <canvas className="absolute z-0" id="gradient-canvas" data-transition-in />
                <div className="z-1 container mx-auto px-6 py-4 flex-grow flex flex-col">
                    <div className="w-full sm:w-md bg-discord-black-60 shadow-xl rounded-lg m-auto flex flex-col justify-center px-6 py-12 md:px-8 gap-6">
                        <img className="h-24 mx-auto" src="/public/infinitea.svg" />
                        <h1 className="text-center text-xl">InfiniTea</h1>
                        <div className="w-xs mx-auto">
                            <button
                                onClick={onAuthClick}
                                type="button"
                                className="flex transition w-full justify-center rounded-md bg-discord-blue px-3 py-1.5 text-sm/6 font-semibold shadow-xs hover:scale-103 active:scale-97"
                            >
                                <img className="h-7 mr-2" src="/public/discord.svg" />
                                Login via Discord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};
