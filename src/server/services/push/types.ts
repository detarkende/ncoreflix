import { z } from 'zod';

const subscriptionSchema = z.object({
	endpoint: z.string(),
	keys: z.object({
		auth: z.string(),
		p256dh: z.string(),
	}),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

export const isSubscription = (data: unknown): data is Subscription => {
	const { success } = subscriptionSchema.safeParse(data);
	return success;
};

export interface NotificationPayload {
	title: string;
	tag?: string;
	body: string;
	icon?: string;
	actionURL?: string;
	actionTitle?: string;
}
