import { readFile, writeFile } from 'fs/promises';
import { globSync } from 'glob';
import { parseSync, stringifySync } from 'subtitle';
import extract from 'rip-subtitles';
import { getFileName, getParentFolder } from './utils/path/pathUtils';
import { extname } from 'path';
import { env } from '@/environment/server';

export const getAllSubtitleFilesInDir = async (
	dirPath: string,
): Promise<string[]> => {
	if (env.EXTRACT_SUBTITLES_FROM_MKV === 'true') {
		const mkvVideos = globSync(`${dirPath}/**/*.{mkv,MKV}`);
		const promises = mkvVideos.map((videoPath) => {
			return new Promise<void>((resolve, reject) =>
				extract(videoPath, (err, subtitles) => {
					if (err) {
						reject(err);
					} else {
						writeFile(
							`${getParentFolder(videoPath)}/${getFileName(
								videoPath,
							)}-extracted-subtitles.srt`,
							subtitles,
						).then(() => resolve());
					}
				}),
			);
		});
		await Promise.allSettled(promises);
	}
	const subtitles = globSync(`${dirPath}/**/*.{srt,SRT}`);
	return subtitles;
};

export const convertSubtitle = async (path: string): Promise<string> => {
	const file = await readFile(path, 'utf-8');
	if (extname(path) === '.vtt') return file;
	const subtitle = parseSync(file);
	const lines = stringifySync(subtitle, { format: 'WebVTT' }).split('\n');
	for (let i = 0; i < lines.length; i++) {
		lines[i] = removeTags(lines[i]);
	}
	return lines.join('\n');
};

const removeTags = (str: string) => str.replace(/(<([^>]+)>)/gi, '');
