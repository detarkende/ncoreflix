import { z } from 'zod';

const torrentCategories = [
	'HD/EN',
	'HD/HU',
	'SD/HU',
	'SD/EN',
	'DVDR/EN',
	'DVDR/HU',
	'DVD9/EN',
	'DVD9/HU',
	'-',
] as const;
export const isTorrentCategory = (
	value: unknown,
): value is (typeof torrentCategories)[number] => {
	return torrentCategories.includes(
		value as (typeof torrentCategories)[number],
	);
};

const torrentCategorySchema = z.enum(torrentCategories);

export const torrentSchema = z.object({
	imdbId: z.string(),
	name: z.string(),
	url: z.string(),
	size: z.string(),
	seeders: z.string(),
	date: z.string(),
	category: torrentCategorySchema,
});

export const torrentArraySchema = z.array(torrentSchema);

export type Torrent = z.infer<typeof torrentSchema>;

export type PaginationDetails = {
	currentPage: number;
	totalPages: number;
};
