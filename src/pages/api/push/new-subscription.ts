import type { APIRoute } from 'astro';
import db from '@/db';
import { sendNotification } from '@/helpers/web-push';

const isString = (str: string): str is string => {
	return !!str && typeof str === 'string';
};

export interface Subscription {
	endpoint: string;
	keys: {
		auth: string;
		p256dh: string;
	};
}

const isSubscription = (obj: {
	keys: { auth: string; p256dh: string };
	endpoint: string;
}): obj is Subscription => {
	const {
		keys: { auth, p256dh },
		endpoint,
	} = obj;
	return isString(auth) && isString(p256dh) && isString(endpoint);
};

export const post: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();
		console.log(`👤 - New request for new subscriber`);
		const {
			keys: { auth, p256dh },
			endpoint,
		} = data;
		if (!isSubscription({ keys: { auth, p256dh }, endpoint })) {
			console.log(
				`❌ - Wrong subscription format ${JSON.stringify(data)}`,
			);
			return new Response('bad request', { status: 400 });
		}

		await db.push('/subscriptions[]', { keys: { auth, p256dh }, endpoint });
		console.log(`🔔 - New Push notification subscriber Saved`);

		setTimeout(() => {
			sendNotification([{ keys: { auth, p256dh }, endpoint }], {
				title: 'nCore',
				body: 'Notificatin is working',
				tag: 'nCore',
				actionURL: '/downloads',
				actionTitle: 'Go to downloads',
			});
		}, 10_000);
		return new Response(
			JSON.stringify({ message: 'Successful subscription' }),
		);
	} catch (e) {
		console.error(e);
		return new Response('something went wrong', { status: 500 });
	}
};
