import webpush from 'web-push';
import { env } from '@/environment/server';

webpush.setVapidDetails(
	'mailto:dkende4@gmail.com',
	env.PUBLIC_VAPID_PUBLIC_KEY,
	env.VAPID_PRIVATE_KEY,
);

export default webpush;
