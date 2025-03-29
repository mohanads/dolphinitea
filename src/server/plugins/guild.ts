import Elysia from 'elysia';
import CacheClient from '../../clients/cache';

export default () => new Elysia()
    .put('/logout', async (context) => {
        const { sessionToken } = context.cookie;
        if (!sessionToken?.value) return;
        await CacheClient.delete(sessionToken.value);
    });
