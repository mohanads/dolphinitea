import Elysia from 'elysia';
import { i18n } from '@lingui/core';
import * as Language from '../../language';
import { logger } from '../../logger';

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

export default () => new Elysia().use((app) => app.derive({ as: 'local' }, (context) => {
    if (!context.headers['accept-language']) {
        logger.info('No accept-language header. Activating default locale', { locale: Locale.en });
        i18n.activate("en");
        return;
    }

    logger.info("Accept-language header provided. Attempting to use", { acceptLanguage: context.headers['accept-language'] });
    const locale = context.headers['accept-language'].substring(0, 2);

    if (!(locale in Locale && locale in Language)) {
        logger.info("Accept-language unsupported. Using fallback/default", { locale });
        i18n.activate("en");
        return;
    }

    logger.info("Supported accept-language provided. Activating it", { locale });
    i18n.activate(locale);
}));
