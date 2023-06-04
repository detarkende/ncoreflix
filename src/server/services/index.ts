import { env } from '@/environment/server';
import { Ncore } from './ncore';
import { Transmission } from './torrents';

export const nCore = new Ncore({
	username: env.NCORE_USERNAME,
	password: env.NCORE_PASSWORD,
	url: env.NCORE_URL,
});

export const transmission = new Transmission({
	port: env.INTERNAL_TRANSMISSION_PORT,
	downloadDir: '/media/shared',
	username: env.TRANSMISSION_USERNAME,
	password: env.TRANSMISSION_PASSWORD,
});
