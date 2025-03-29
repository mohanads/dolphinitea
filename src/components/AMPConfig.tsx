import { useState } from 'preact/hooks';
import { SupabaseGuildConfig } from '../clients/supabase';

interface Props {
    config: SupabaseGuildConfig['amp'];
}

export default (props: Props) => {
    const [controllerUrl, setControllerUrl] = useState(props.config?.controller_url || '');
    const [username, setUsername] = useState(props.config?.bot_username || '');
    const [password, setPassword] = useState('**************');

    const onControllerUrlInput = (event) => {
        setControllerUrl(event.currentTarget.value);
    };

    const onUsernameInput = (event) => {
        setUsername(event.currentTarget.value);
    };

    const onPasswordInput = (event) => {
        setPassword(event.currentTarget.value);
    };

    return (
        <section className="block max-w-full md:max-w-sm bg-discord-black-70 rounded-lg p-6 shadow-xl flex flex-col gap-6">
            <div>
                <label for="controllerUrl" className="block mb-2 text-sm font-medium">Controller URL</label>
                <input value={controllerUrl} onInput={onControllerUrlInput} type="url" id="controllerUrl" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="https://example.io" required />
            </div>
            <div>
                <label for="botUsername" className="block mb-2 text-sm font-medium">Bot Username</label>
                <input value={username} onInput={onUsernameInput} type="text" id="botUsername" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="*******" required />
            </div>
            <div>
                <label for="botPassword" className="block mb-2 text-sm font-medium">Bot Password</label>
                <input value={password} onInput={onPasswordInput} type="password" id="botPassword" className="bg-discord-black-60 text-sm rounded-lg block w-full p-2.5" placeholder="infiniti-rw" required />
            </div>
        </section>
    );
}
