import { hashPassword } from '@/server/auth/auth';
import { prisma } from '@/server/db/client';
import { redirectWithToast } from '@/server/toast-messages/redirect-with-toast';
import type { APIRoute } from 'astro';
import { z } from 'zod';

export const requestSchema = z.object({
	username: z.string().min(3).max(20),
	name: z.string().min(3).max(100),
	password: z.string().min(8).max(100),
});

export const post: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData();
	const body: Record<string, FormDataEntryValue> = {};
	formData.forEach((value, key) => (body[key] = value));
	try {
		const { name, username, password } = requestSchema.parse(body);

		const user = await prisma.user.create({
			data: {
				username,
				name,
				passwordHash: await hashPassword(password),
			},
		});
		return redirectWithToast({
			to: '/account',
			messages: {
				type: 'success',
				message: `Account created for ${user.username}`,
			},
			redirect,
		});
	} catch (e) {
		return redirectWithToast({
			to: '/account',
			messages: {
				type: 'error',
				message: `Bad request: ${JSON.stringify(e)}`,
			},
			redirect,
		});
	}
};
