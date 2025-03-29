import { hydrate } from 'preact';
import { i18n } from '@lingui/core';
import App from './components/App';
import * as Language from './language';

const locale = "en";

i18n.load(locale, Language[locale]);
i18n.activate(locale);

hydrate(<App />, document.querySelector('#root')!);
