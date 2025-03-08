import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import pages from './plugins/pages';
import auth from './plugins/auth';
import locale from './plugins/locale';

const app = new Elysia()
    .use(staticPlugin())
    .use(locale())
    .use(auth())
    .use(pages());

app.listen(8888, (server) => {
    console.log(`Listening on ${server.url}`);
});
