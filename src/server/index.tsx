import 'newrelic';
import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import pages from './plugins/pages';
import auth from './plugins/auth';
import locale from './plugins/locale';
import { logger } from '../logger';

const app = new Elysia()
    .use(staticPlugin())
    .use(locale()
        .use(auth())
        .use(pages())
    );

app.listen(process.env.PORT || 80, (server) => {
    logger.info(`Listening on ${server.url}`);
});
