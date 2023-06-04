import { isAuthenticated } from '@/helpers/utils/auth/auth';
import { notifyAll } from '@/helpers/web-push';
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ request }) => {
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	notifyAll({
		title: 'nCore',
		body: 'Notificatin is working',
		tag: 'nCore',
		actionURL: '/downloads',
		actionTitle: 'Go to downloads',
	});
	return new Response();
};
