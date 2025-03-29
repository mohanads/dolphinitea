import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { State } from '../state';
import Layout from '../components/Layout';
import { i18n } from '@lingui/core';

export default () => {
    const state = useContext(State);

    return (
        <Layout>
            <div className="container mx-auto p-6 flex-grow flex flex-col">
                <section className="w-full md:w-md bg-discord-black-60 rounded-lg p-6 m-auto flex flex-col gap-6">
                    <h1 className="text-5xl font-semibold">{i18n.t('Unauthorized')}</h1>
                    <div className='text-sm'>{i18n.t('Sorry, but your access to this page was denied.')}</div>
                    <div className="flex gap-6">
                        <a href="/" className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">{i18n.t('Back to Home')}</a>
                        <a href="/contact-us" className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">{i18n.t('Contact Us')}</a>
                    </div>
                </section>
            </div>
        </Layout>
    );
};
