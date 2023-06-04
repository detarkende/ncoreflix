import { getUser } from '@astro-auth/core';
import type { AstroGlobal } from 'astro';

export function isAuthenticated(param: Request | AstroGlobal): boolean {
	const user =
		param instanceof Request
			? getUser({ server: param })
			: getUser({ client: param });
	return !!user;
}
