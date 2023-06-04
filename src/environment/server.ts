import { z } from 'zod';

const envSchema = {
	NCORE_USERNAME: z.string(),
	NCORE_PASSWORD: z.string(),
	TMDB_TOKEN: z.string(),
	TRANSMISSION_USERNAME: z.string(),
	TRANSMISSION_PASSWORD: z.string(),
	TRANSMISSION_DOWNLOAD_DIR: z.string(),
	ASTROAUTH_SECRET: z.string(),
	AUTH_PASSWORD: z.string(),
	VAPID_PRIVATE_KEY: z.string(),
	PUBLIC_VAPID_PUBLIC_KEY: z.string(),

	PORT: z.string(),
	NCORE_URL: z.string().url(),
	TMDB_API_URL: z.string().url(),
	INTERNAL_TRANSMISSION_PORT: z.string(),
	ASTROAUTH_URL: z.string(),
	EXTRACT_SUBTITLES_FROM_MKV: z.enum(['true', 'false']),
	DOCKER_WORKDIR: z.string(),
	DOCKER_START_COMMAND: z.string(),
	TRANSMISSION_PEER_PORT: z.string(),
	DOCKER_NODE_ENV: z.enum(['development', 'production']),
};

const envVars = Object.keys(envSchema).reduce((acc, key) => {
	const value = import.meta.env[key];
	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return { ...acc, [key]: value };
}, {});

export const env = z.object({ ...envSchema }).parse(envVars);
