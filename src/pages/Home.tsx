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

        window.open(process.env.DISCORD_AUTH_LINK, '_blank', 'width=600,height=900');
    };

    useEffect(() => {
        const gradient = new Gradient();

        gradient.initGradient('#gradient-canvas');
    }, []);

    return (
        <main className="min-h-screen bg-slate-100 flex flex-col">
            <div className="min-h-screen flex flex-col relative">
                <canvas className="absolute z-0" id="gradient-canvas" data-transition-in />
                <div className="z-1 container mx-auto px-6 py-4 flex-grow flex flex-col">
                    <div className="w-full sm:w-md bg-white border border-gray-300 shadow-xl rounded-lg m-auto flex flex-col justify-center px-6 py-18 md:px-8">
                        <div>
                            <h1 className="text-center text-xl font-semibold text-gray-600">InfiniTea</h1>
                            <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login to your account</h2>
                        </div>

                        <div className="mt-6 w-full mx-auto">
                            <button
                                onClick={onAuthClick}
                                type="button"
                                className="flex transition w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:scale-103 active:scale-97"
                            >
                                <img className="h-7 text-white mr-2" src="/public/discord.svg" />
                                Discord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};
