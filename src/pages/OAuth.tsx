import { useContext, useEffect } from 'preact/hooks';
import { State } from '../state';
import Layout from '../components/Layout';

export default () => {
    const state = useContext(State);

    useEffect(() => {
        const authCode = new URLSearchParams(window.location.search).get('code')
        const windowMessage = { type: 'oauth2', authCode, };
        window.opener?.postMessage(windowMessage);
        window.close();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-6 py-4 flex-grow flex flex-col">
                <div className="m-auto">
                    <div>Hey, {state.user!.global_name}!</div>
                    <div>Sending you to InfiniTea</div>
                </div>
            </div>
        </Layout>
    );
};
