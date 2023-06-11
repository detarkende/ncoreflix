import type { ValidRedirectStatus } from 'astro';
import type { ToastMessage } from './types';

const FIVE_SECONDS = 5_000;

export const redirectWithToast = ({
	to,
	messages,
	redirect,
	statusCode = 303,
}: {
	to: string;
	messages: ToastMessage | ToastMessage[];
	redirect?: (to: string, status?: ValidRedirectStatus) => Response;
	statusCode?: ValidRedirectStatus;
}): Response => {
	const messageArray = Array.isArray(messages) ? messages : [messages];
	const response = redirect
		? redirect(to, statusCode)
		: new Response(null, { status: statusCode, headers: { Location: to } });
	response.headers.append(
		'Set-Cookie',
		`toast-messages=${JSON.stringify(
			messageArray,
		)}; Path=/; maxAge=${FIVE_SECONDS}`,
	);
	return response;
};
