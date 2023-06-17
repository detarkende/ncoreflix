import type { APIRoute } from 'astro';
import { subscribeToNotifications } from '@/server/services/push';

export const post: APIRoute = async ({ request, redirect, locals }) => {
	const data = await request.json();
	const toastMessage = await subscribeToNotifications(data, locals.user);

	return new Response(JSON.stringify(toastMessage), {
		status: toastMessage.type === 'success' ? 200 : 400,
	});
};
