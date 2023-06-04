import { isAuthenticated } from '@/helpers/utils/auth/auth';
import { nCore } from '@/server/services';
import { transmission } from '@/server/services';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, redirect }) => {
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const data = await request.formData();
	const url = data.get('torrent');
	if (!url || typeof url !== 'string') {
		return new Response('No torrent url provided', { status: 400 });
	}
	const downloadUrl = await nCore.getTorrentDownloadLink({ url });

	await transmission.addTorrent({ url: downloadUrl });

	return redirect('/torrents', 301);
};
