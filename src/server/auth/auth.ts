import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { prisma } from '../db/client';
import cookie from 'cookie';
import { env } from '@/environment/server';
import type { User } from '@prisma/client';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> => {
	return hash(password, SALT_ROUNDS);
};

export const comparePasswordToHash = ({
	password,
	hash,
}: {
	password: string;
	hash: string;
}): Promise<boolean> => {
	return compare(password, hash);
};

export const generateSessionId = async (length = 20): Promise<string> => {
	const randomString = randomBytes(length).toString('base64');
	const existingSessionId = await prisma.authSession.findUnique({
		where: { id: randomString },
	});
	if (existingSessionId !== null) {
		return generateSessionId(length);
	}
	return randomString;
};

export const generateCookieString = (sessionId: string, maxAge: number) => {
	const cookieString = cookie.serialize('sessionId', sessionId, {
		httpOnly: true,
		secure: env.DOCKER_NODE_ENV === 'production',
		path: '/',
		sameSite: 'lax',
		maxAge,
	});
	return cookieString;
};

export const getUserFromSessionId = async (
	sessionId: string,
): Promise<User | null> => {
	const session = await prisma.authSession.findUnique({
		include: {
			user: true,
		},
		where: {
			id: sessionId,
		},
	});
	return session?.user ?? null;
};
