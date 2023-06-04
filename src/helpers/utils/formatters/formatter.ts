export const bytesToString = (bytes: number, decimals = 2): string => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	if (bytes == 0) return `0 ${units[0]}`;
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	let size = (bytes / Math.pow(k, i)).toFixed(decimals);
	if (size.endsWith('.00')) size = size.slice(0, -3);
	return `${size}${units[i]}`;
};

export const dateToString = (date: Date | number): string => {
	const value = typeof date === 'number' ? new Date(date) : date;

	const formatter = Intl.DateTimeFormat('hu', {
		dateStyle: 'short',
	});
	return formatter.format(value);
};

export const isValidDateString = (date: string): boolean => {
	return !Number.isNaN(Date.parse(date));
};

export const getReleaseYear = (date: string | undefined): string => {
	if (!date) return '-';
	if (!isValidDateString(date)) {
		return '-';
	}
	return new Date(date).getFullYear().toString();
};

export const getReleaseYearsFromTo = (from?: string, to?: string): string => {
	if (!from || !isValidDateString(from)) return '-';
	const fromYear = getReleaseYear(from);
	if (to === undefined) return `${fromYear} - Present`;
	if (!isValidDateString(to)) return `${fromYear} - ?`;
	return `${fromYear} - ${getReleaseYear(to)}`;
};

export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
