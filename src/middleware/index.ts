import { getUserFromSessionId } from '@/server/auth/auth';
import type { MiddlewareEndpointHandler } from 'astro';

export const onRequest: MiddlewareEndpointHandler = async (
	{ locals, redirect, cookies, url },
	next,
) => {
	try {
		const sessionId = cookies.get('sessionId');
		if (!sessionId.value) {
			if (
				url.pathname === '/login' ||
				url.pathname === '/api/auth/login'
			) {
				return next();
			}
			return redirect('/login', 303);
		}

		const user = await getUserFromSessionId(sessionId.value);
		if (!user) {
			const response = redirect('/login', 303);
			response.headers.set(
				'Set-Cookie',
				`sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
			);
			return response;
		}
		if (url.pathname === '/login') {
			return redirect('/', 303);
		}
		locals.user = user;
		return next();
	} catch (e) {
		console.error(e);
		return redirect('/login', 301);
	}
};
