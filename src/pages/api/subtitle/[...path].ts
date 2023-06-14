import type { APIRoute } from 'astro';
import { convertSubtitle } from '../../../helpers/subtitles';
import { SUPPORTED_SUBTITLE_FORMAT } from '../../../helpers/constants/constants';
import { env } from '@/environment/server';

export const get: APIRoute = async ({ params }) => {
	const filePath = `${env.TRANSMISSION_DOWNLOAD_DIR}/${params.path?.replace(
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
