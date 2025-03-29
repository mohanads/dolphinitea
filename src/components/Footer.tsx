import { i18n } from '@lingui/core';

export default function () {
    const discordLink = process.env.DISCORD_INVITE_LINK;
    const githubLink = process.env.GITHUB_LINK;

    return (
        <footer className="bg-discord-black-90 border-t-2 border-discord-black-80 shadow-xl">
            <div className="mx-auto container p-6">
                <div className="md:flex md:justify-between">
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-gray-400/75">{i18n.t('Follow us')}</h2>
                            <ul className="flex flex-col gap-6">
                                <li>
                                    <a href={discordLink} className="hover:underline">Discord</a>
                                </li>
                                <li>
                                    <a href={githubLink} className="hover:underline ">Github</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-gray-400/75">{i18n.t('Legal')}</h2>
                            <ul className="flex flex-col gap-6">
                                <li>
                                    <a href="/privacy" className="hover:underline">{i18n.t('Privacy Policy')}</a>
                                </li>
                                <li>
                                    <a href="/terms" className="hover:underline">{i18n.t('Terms & Conditions')}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}
