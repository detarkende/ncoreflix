// /pages/api/auth/[...astroauth].ts

import { env } from '@/environment/server';
import AstroAuth from '@astro-auth/core';
import { CredentialProvider } from '@astro-auth/providers';

export const all = AstroAuth({
	authProviders: [
		CredentialProvider({
			authorize: async (properties) => {
				if (properties?.password === env.AUTH_PASSWORD) {
					return {
						id: 0,
						name: 'Admin',
					};
				}
				return null;
			},
		}),
	],
});
