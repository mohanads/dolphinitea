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

export default () => new Elysia({ name: 'locale-plugin' })
    .use((app) => app.derive({ as: 'scoped' }, async (context) => {
        logger.info('Parsing locale');
        const logMetadata: Record<string, unknown> = {};

        if (!context.headers['accept-language']) {
            const locale = Locale.en;
            logMetadata.locale = locale;
            logger.info(logMetadata, 'No accept-language header. Activating default locale', logMetadata);
            i18n.activate(locale);
            return { locale };
        }

        logMetadata.acceptLanguage = context.headers['accept-language'];
        logger.info("Accept-language header provided. Attempting to use", logMetadata);
        const locale = context.headers['accept-language'].substring(0, 2);
        logMetadata.locale = locale;

        if (!(locale in Locale && locale in Language)) {
            logger.info(logMetadata, "Accept-language unsupported. Using fallback/default", logMetadata);
            i18n.activate(Locale.en);
            return { locale };
        }

        logger.info("Supported accept-language provided. Activating it", logMetadata);
        i18n.activate(locale);
        return { locale };
    }));
