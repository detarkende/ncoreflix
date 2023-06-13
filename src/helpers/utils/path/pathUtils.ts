import { env } from '@/environment/server';
import { join, sep, basename } from 'path';

export const getUrlFromPath = (path: string) => {
	return path.replace(env.TRANSMISSION_DOWNLOAD_DIR, '');
};

export const getPathFromUrl = (url: string) => {
	const newUrl = url.startsWith(sep) ? url.substring(1) : url;
	return `${env.TRANSMISSION_DOWNLOAD_DIR}/${newUrl}`;
};

export const getParentFolder = (filePath: string): string => {
	return join(filePath, '..');
};

export const getFileName = (filePath: string): string => {
	if (filePath.endsWith(sep)) return '';
	return basename(filePath);
};
