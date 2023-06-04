import { getFileName, getParentFolder } from './pathUtils';

describe('getParentFolder', () => {
	it('should return the parent folder of a file path', () => {
		expect(getParentFolder('/path/to/file.txt')).toBe('/path/to');
		expect(getParentFolder('/path/to/directory/')).toBe('/path/to');
	});
});

describe('getFileName', () => {
	it('should return the file name from a file path', () => {
		expect(getFileName('/path/to/file.txt')).toBe('file.txt');
		expect(getFileName('/path/to/directory/')).toBe('');
	});
});
