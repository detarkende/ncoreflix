import type { APIRoute } from 'astro';
import { glob } from 'glob';
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';
import { notifyAll } from '@/helpers/web-push';

export const get: APIRoute = async ({ url }) => {
	const path = url.searchParams.get('path'); // await request.json();
	console.log(`🌐 - New webhook request. path = ${path}`);

	if (!path || typeof path !== 'string' || path === '') {
		return new Response('Missing path', { status: 400 });
	}

	notifyAll({
		title: 'New torrent downloaded!',
		body: path?.replace('/media/share', '') ?? '',
	});

	try {
		const mkvVideos = await glob(`${path}/**/*.mkv`);
		console.log({ mkvVideos });
		if (mkvVideos.length === 0) {
			return new Response('No mkv files found', { status: 200 });
		}

		const promises = mkvVideos.map((videoPath) => {
			return new Promise<string>((resolve) => {
				const outputPath = videoPath.replace(/\.mkv$/, '.mp4');
				const ffmpeg = spawn('ffmpeg', [
					'-y',
					'-i',
					`${videoPath}`,
					'-vcodec',
					'copy',
					'-acodec',
					'mp3',
					`${outputPath}`,
				]);
				ffmpeg.stdout.on('data', (data) => {
					console.log(`ffmpeg: ${data}`);
				});
				ffmpeg.stderr.on('data', (data) => {
					console.log(`ffmpeg err: ${data}`);
				});
				ffmpeg.on('close', (code) => {
					console.log(`FFMPEG exited with code: ${code}`);
					resolve('One torrent is done');
				});
			});
		});
		promises.push(setTimeout(5_000, 'Everything seems fine'));
		const response = await Promise.any(promises);
		Promise.allSettled(promises)
			.then(() => {
				console.log({ promises });
				notifyAll({
					title: 'New files converted',
					body: 'Some new files have finished conversion to MP4. Take a look!',
				});
			})
			.catch((e) => {
				console.error(e);
			});

		return new Response(response, { status: 200 });
	} catch (error: unknown) {
		console.error(error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
