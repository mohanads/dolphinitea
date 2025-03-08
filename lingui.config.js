import { defineConfig } from '@lingui/cli';

export default defineConfig({
    sourceLocale: 'en',
    locales: ['en', 'es', 'cn', 'ru', 'kr'],
    catalogs: [
        {
            path: '<rootDir>/src/language/{locale}/messages',
            include: ['src'],
        },
    ],
});
