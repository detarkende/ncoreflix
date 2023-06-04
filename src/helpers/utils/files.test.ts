import { VIDEO_EXTENSIONS } from '../constants/constants';

import { isVideoPath } from './files';

describe('isVideoPath', () => {
	it('returns false to empty value', () => {
		expect(isVideoPath('')).toBe(false);
	});

	it('returns false to no extension or wrong extension value', () => {
		expect(isVideoPath('')).toBe(false);
		expect(isVideoPath('test.txt')).toBe(false);
	});

	it('returns true to valid extension value', () => {
		expect(isVideoPath(`/path/to/test.${VIDEO_EXTENSIONS[0]}`)).toBe(true);
	});
});
