import type { APIRoute } from 'astro';
import { convertSubtitle } from '../../../helpers/subtitles';
import { SUPPORTED_SUBTITLE_FORMAT } from '../../../helpers/constants/constants';
import { isAuthenticated } from '@/helpers/utils/auth/auth';

export const get: APIRoute = async ({ request, params }) => {
	if (!isAuthenticated(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const filePath = `/media/share/${params.path?.replace(
		/\.srt\.vtt$/,
		'.srt',
	)}`;
	const converted = await convertSubtitle(filePath);
	return new Response(converted, {
		headers: {
			'Content-Type': `text/${SUPPORTED_SUBTITLE_FORMAT}`,
		},
	});
};
