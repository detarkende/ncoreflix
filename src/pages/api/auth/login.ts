import {
	comparePasswordToHash,
	generateCookieString,
	generateSessionId,
} from '@/server/auth/auth';
import { prisma } from '@/server/db/client';
import { redirectWithToast } from '@/server/toast-messages/redirect-with-toast';
import type { APIRoute } from 'astro';
import { z } from 'zod';

const inputSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

export const post: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData();
	const { username, password } = inputSchema.parse({
		username: formData.get('username'),
		password: formData.get('password'),
	});

	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	const isPasswordCorrect = await comparePasswordToHash({
		password,
		hash: user?.passwordHash ?? '',
	});
	if (!user || !isPasswordCorrect) {
		return redirectWithToast({
			to: '/login',
			redirect,
			messages: {
				message: 'Incorrect username or password',
				type: 'error',
			},
		});
	}
	const sessionId = await generateSessionId();
	const authSession = await prisma.authSession.create({
		data: {
			id: sessionId,
			userId: user.id,
		},
	});
	return new Response(null, {
		status: 303,
		headers: {
			'Set-Cookie': generateCookieString(authSession.id, ONE_WEEK),
			Location: '/',
		},
	});
};
