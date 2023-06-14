import { nCore } from '@/server/services';
import { transmission } from '@/server/services';
import { redirectWithToast } from '@/server/toast-messages/redirect-with-toast';
import type { APIRoute } from 'astro';
import { z } from 'zod';

const inputSchema = z.object({
	url: z.string(),
	path: z.string(),
});

export const post: APIRoute = async ({ request, redirect, locals }) => {
	const data = await request.formData();
	const url = data.get('torrent');
	const path = data.get('torrent-name');
	const validation = inputSchema.safeParse({ url, path });
	if (!validation.success || !locals.user) {
		return redirectWithToast({
			to: request.url,
			redirect,
			messages: {
				message: 'Bad request',
				type: 'error',
			},
		});
	}
	const downloadUrl = await nCore.getTorrentDownloadLink({
		url: validation.data.url,
	});

	const torrent = await transmission.addTorrent({
		url: downloadUrl,
		userId: locals.user.id,
		paused: true,
		path: validation.data.path,
	});
	console.log(torrent);

	return redirectWithToast({
		to: '/torrents',
		redirect,
		messages: {
			message: `${validation.data.path} added to torrents`,
			type: 'success',
		},
	});
};
