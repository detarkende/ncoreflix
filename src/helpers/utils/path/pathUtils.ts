import { join, sep, basename } from 'path';

export const getUrlFromPath = (path: string) => {
	return path.replace('/media/share', '');
};

export const getPathFromUrl = (url: string) => {
	const newUrl = url.startsWith(sep) ? url.substring(1) : url;
	return `/media/share/${newUrl}`;
};

export const getParentFolder = (filePath: string): string => {
	return join(filePath, '..');
};

export const getFileName = (filePath: string): string => {
	if (filePath.endsWith(sep)) return '';
	return basename(filePath);
};
