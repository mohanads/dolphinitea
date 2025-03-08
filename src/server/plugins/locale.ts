import Elysia from 'elysia';
import { i18n } from '@lingui/core';
import * as Language from '../../language';

enum Locale {
    en = "en",
    es = "en",
    ru = "en",
    cn = "cn",
    kr = "kr"
}

Object.keys(Locale).forEach((locale) => {
    i18n.load(locale, Language[locale]);
})

export default () => new Elysia().use((app) => app.derive({ as: 'scoped' }, (context) => {
    i18n.activate(Locale.cn);
    return;
    if (!context.headers['accept-language']) {
        console.log('No accept-language header. Activating default locale', { locale: Locale.en });
        i18n.activate("en");
        return;
    }

    console.log("Accept-language header provided. Attempting to use", { acceptLanguage: context.headers['accept-language'] });
    const locale = context.headers['accept-language'].substring(0, 2);

    if (!(locale in Locale && locale in Language)) {
        console.log("Accept-language unsupported. Using fallback/default", { locale });
        i18n.activate("en");
        return;
    }

    console.log("Supported accept-language provided. Activating it", { locale });
    i18n.activate(locale);
}));
