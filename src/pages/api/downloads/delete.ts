import { isAuthenticated } from '@/helpers/utils/auth/auth';
import {
	getParentFolder,
	getPathFromUrl,
} from '@/helpers/utils/path/pathUtils';
import type { APIRoute } from 'astro';
import { rm } from 'fs/promises';

export const post: APIRoute = async ({ request, url }) => {
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const data = await request.formData();
		const file = data.get('file');
		if (typeof file !== 'string') {
			throw new TypeError('Wrong type of "file" value.');
		}

		await rm(getPathFromUrl(file), { recursive: true });

		return Response.redirect(
			`${url.origin}/downloads${getParentFolder(file)}`,
			302,
		);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
		});
	}
};
