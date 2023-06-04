import db from '@/db';
import type { Subscription } from '@/pages/api/push/new-subscription';
import webpush from 'web-push';
import { env } from '@/environment/server';

webpush.setVapidDetails(
	'mailto:dkende4@gmail.com',
	env.PUBLIC_VAPID_PUBLIC_KEY,
	env.VAPID_PRIVATE_KEY,
);

export default webpush;

interface NotificationPayload {
	title: string;
	tag?: string;
	body: string;
	icon?: string;
	actionURL?: string;
	actionTitle?: string;
}
export const sendNotification = (
	subscriptions: Subscription[],
	{
		title,
		tag = 'nCore',
		body,
		icon = '/favicons/apple-icon.png',
		actionURL = '/',
		actionTitle = 'Go to URL',
	}: NotificationPayload,
) => {
	const payload = {
		title,
		tag,
		body,
		icon,
		actionURL,
		actionTitle,
	};
	subscriptions.forEach((pushSubscription) => {
		try {
			webpush
				.sendNotification(pushSubscription, JSON.stringify(payload))
				.catch(console.error);
		} catch (e) {
			console.error(
				`Error sending notification: ${JSON.stringify(
					pushSubscription,
				)}`,
			);
		}
	});
};

export const notifyAll = (payload: NotificationPayload) => {
	console.log(`🔔 - Now notifying everyone: "${payload.title}"`);
	db.getData('/subscriptions').then((subscriptions) => {
		try {
			sendNotification(subscriptions, payload);
		} catch (e) {
			console.error(e);
		}
	});
};
