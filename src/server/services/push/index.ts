import type { ToastMessage } from '@/server/toast-messages/types';
import { isSubscription } from './types';
import type { User } from '@prisma/client';
import { prisma } from '@/server/db/client';

export const subscribeToNotifications = async (
	subscription: unknown,
	user: User,
): Promise<ToastMessage> => {
	if (!isSubscription(subscription)) {
		return {
			type: 'error',
			message: 'Wrong subscription format',
		};
	}
	const savedSubscription = await prisma.pushSubscription.create({
		data: {
			endpoint: subscription.endpoint,
			auth: subscription.keys.auth,
			p256dh: subscription.keys.p256dh,
			userId: user.id,
		},
	});
	if (savedSubscription) {
		return {
			type: 'success',
			message: 'Subscription saved',
		};
	}
	return {
		type: 'error',
		message: 'Subscription not saved',
	};
};
