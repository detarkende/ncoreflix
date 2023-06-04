import type { APIRoute } from 'astro';
import { createReadStream, statSync } from 'fs';
import { isVideoPath } from '../../../../helpers/utils/files';
import { isAuthenticated } from '@/helpers/utils/auth/auth';

const CHUNK_SIZE = 10 ** 6; // 1MB

export const get: APIRoute = ({ request, params }) => {
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const filePath = `/media/share/${params.path}`;
	const videoSize = statSync(filePath).size;
	const isVideo = isVideoPath(filePath);

	if (!isVideo) {
		const readableStream = createReadStream(filePath);
		// @ts-expect-error The type definitions for the Response constructor are wrong
		return new Response(readableStream);
	} else {
		const range = request.headers.get('range');
		let start = 0;
		let end = videoSize - 1;

		if (range) {
			const [startVal, endVal] = range.replace(/bytes=/, '').split('-');
			start = Number(startVal);
			end = endVal
				? Number(endVal)
				: Math.min(start + CHUNK_SIZE, videoSize - 1);
		}

		const readableStream = createReadStream(filePath, { start, end });
		// @ts-expect-error The type definitions for the Response constructor are wrong
		return new Response(readableStream, {
			headers: {
				'Content-Range': `bytes ${start}-${end}/${videoSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': end - start + 1,
				'Content-Type': 'video/mp4',
			},
			status: 206,
		});
	}
};
