import { nCore } from '@/server/services';
import { transmission } from '@/server/services';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, redirect }) => {
	const data = await request.formData();
	const url = data.get('torrent');
	if (!url || typeof url !== 'string') {
		return new Response('No torrent url provided', { status: 400 });
	}
	const downloadUrl = await nCore.getTorrentDownloadLink({ url });

	const torrent = await transmission.addTorrent({
		url: downloadUrl,
		paused: true,
	});
	console.log(torrent);

	return redirect('/torrents', 301);
};
