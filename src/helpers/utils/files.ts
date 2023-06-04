import { extname } from 'path';
import { VIDEO_EXTENSIONS } from '../constants/constants';

export const isVideoExtension = (extension: string): boolean => {
	return VIDEO_EXTENSIONS.includes(extension);
};

export const isVideoPath = (path: string): boolean => {
	const ext = extname(path).replaceAll('.', '').toLowerCase();
	return isVideoExtension(ext);
};
