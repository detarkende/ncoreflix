import type { PushSubscription, User } from '@prisma/client';
import type { NotificationPayload, Subscription } from './types';
import webpush from './webPushConfig';
import { prisma } from '@/server/db/client';

export const convertDbSubscriptionToPushSubscription = (
	dbSubscription: PushSubscription,
): Subscription => ({
	endpoint: dbSubscription.endpoint,
	keys: {
		auth: dbSubscription.auth,
		p256dh: dbSubscription.p256dh,
	},
});

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

export const sendNotificationToUser = async (
	user: User,
	payload: NotificationPayload,
) => {
	const subscriptionsData = await prisma.pushSubscription.findMany({
		where: {
			userId: user.id,
		},
	});
	const subscriptions = subscriptionsData.map(
		convertDbSubscriptionToPushSubscription,
	);

	sendNotification(subscriptions, payload);
};
