import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { logger } from '../logger';
import staticPages from './plugins/staticPages';
import auth from './plugins/auth';
import guilds from './plugins/guilds';
import session from './plugins/session';
import featureFlags from './plugins/featureFlags';
import locale from './plugins/locale';

const app = new Elysia()
    .use(staticPlugin())
    .use(session()
        .use(locale())
        .use(featureFlags())
        .use(staticPages())
        .use(auth())
        .use(guilds())
    );

app.listen(process.env.PORT || 80, (server) => {
    logger.info(`Listening on ${server.url}`);
});
