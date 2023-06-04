import {
	bytesToString,
	dateToString,
	getReleaseYear,
	getReleaseYearsFromTo,
	isValidDateString,
} from './formatter';

describe('bytesToString', () => {
	it('should format bytes to a string', () => {
		expect(bytesToString(1024)).toBe('1KB');
		expect(bytesToString(1048576)).toBe('1MB');
		expect(bytesToString(1073741824)).toBe('1GB');
	});
});

describe('dateToString', () => {
	it('should format date to a string', () => {
		expect(dateToString(new Date('2022-01-01'))).toBe('2022. 01. 01.');
		expect(dateToString(1640995200000)).toBe('2022. 01. 01.');
	});
});

describe('isValidDateString', () => {
	it('should return true if the date string is valid', () => {
		expect(isValidDateString('2023-01-01')).toBe(true);
		expect(isValidDateString('2023-01-32')).toBe(false);
	});
});

describe('getReleaseYear', () => {
	it('should return the release year for a valid date string', () => {
		expect(getReleaseYear('2022-01-01')).toBe('2022');
		expect(getReleaseYear('2023-12-31')).toBe('2023');
	});

	it('should return "-" for an undefined date', () => {
		expect(getReleaseYear(undefined)).toBe('-');
	});

	it('should return "-" for an invalid date string', () => {
		expect(getReleaseYear('2022-13-01')).toBe('-');
		expect(getReleaseYear('2022-01-32')).toBe('-');
		expect(getReleaseYear('invalid date')).toBe('-');
	});
});

describe('getReleaseYearsFromTo', () => {
	it('should return "-" for undefined or invalid "from" date', () => {
		expect(getReleaseYearsFromTo(undefined, '2022-01-01')).toBe('-');
		expect(getReleaseYearsFromTo('invalid date', '2022-01-01')).toBe('-');
	});

	it('should return "fromYear - Present" for undefined "to" date', () => {
		expect(getReleaseYearsFromTo('2022-01-01')).toBe('2022 - Present');
	});

	it('should return "fromYear - ?" for invalid "to" date', () => {
		expect(getReleaseYearsFromTo('2022-01-01', 'invalid date')).toBe(
			'2022 - ?',
		);
	});

	it('should return "fromYear - toYear" for valid "from" and "to" dates', () => {
		expect(getReleaseYearsFromTo('2022-01-01', '2023-12-31')).toBe(
			'2022 - 2023',
		);
	});
});
