import { h } from 'preact';
import { Context, Elysia } from 'elysia';
import render from '../render';
import { ISession } from '../../state';
import { FeatureFlag } from '../../clients/launchDarkly';

export default () => new Elysia({ name: 'static-pages-plugin' })
    .get('/', (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
    })
    .get('/privacy', (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
    })
    .get('/terms', (context: Context & { session: ISession; featureFlags: Record<FeatureFlag, unknown>; }) => {
        context.set.headers = { 'Content-Type': 'text/html' };
        return render({ ...context.session, featureFlags: context.featureFlags }, context.request.url);
    });
