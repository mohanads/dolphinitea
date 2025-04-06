# Dolphinitea
## A web Discord bot management panel proof-of-concept.

* Redis caching to optimize fetching and workaround external API rate limits.
* Preact as a lightweight alternative to React.
* Bun for runtime + bundling. Reduces bundling dependencies by a lot (alternative to rollup).
* Lingui for localization. Working on moving the locale compilation to build-time.
* Motion for simple layout animations.
* Supabase database and database functions. Mainly using database functions to have transactions and rollbacks.
* LaunchDarkly for Feature Flags. Both server-side and client-side feature flags are supported.
* ElysiaJS as the server framework. Elysia is not currently being used extensively. The middleware layer in this app needs a lot of work.
