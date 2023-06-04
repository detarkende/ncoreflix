import { env } from '@/environment/server';
import createClient from 'openapi-fetch';
import type { paths } from 'tmdb';
import { fetchBuilder, MemoryCache } from 'node-fetch-cache';

const cache = new MemoryCache({ ttl: 30_000 });
const cachedFetch = fetchBuilder.withCache(cache);

const { get } = createClient<paths>({
	baseUrl: env.TMDB_API_URL,
	fetch: cachedFetch as typeof globalThis.fetch,
	headers: {
		Authorization: `Bearer ${env.TMDB_TOKEN}`,
	},
});

export const TMDB = { get };
