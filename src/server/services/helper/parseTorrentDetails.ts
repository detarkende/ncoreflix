import { load } from 'cheerio';
import {
	isTorrentCategory,
	type PaginationDetails,
	type Torrent,
} from '@/server/types/ncore';

export const parseTorrentDetails = ({
	html,
	imdbId,
	page,
}: {
	html: string;
	imdbId: string;
	page: number;
}): { torrents: Torrent[]; pagination: PaginationDetails } => {
	const $ = load(html);
	if ($('.box_torrent').length === 0) {
		return {
			torrents: [],
			pagination: {
				currentPage: 1,
				totalPages: 1,
			},
		};
	}
	const torrents: Torrent[] = [];
	$('.box_torrent').each((i, el) => {
		const categoryValue = $(el).find('.categ_link').attr('alt');
		const category = isTorrentCategory(categoryValue) ? categoryValue : '-';
		torrents.push({
			name: $(el).find('nobr').text(),
			url: $(el).find('.torrent_txt > a').attr('href') || '',
			size: $(el).find('.box_meret2').text(),
			seeders: $(el).find('.box_s2').text(),
			date: $(el).find('.box_feltoltve2').text(),
			category: category,
			imdbId: imdbId,
		});
	});

	const lastPageLink = $('div#pager_bottom *:nth-last-child(2)');

	let totalPages = 1;
	if (lastPageLink.length > 0) {
		const lastPageUrl = lastPageLink.attr('href');
		if (lastPageUrl) {
			const lastPage = lastPageUrl.match(/oldal=(\d+)/);
			if (lastPage) {
				totalPages = Number(lastPage[1]);
			}
		} else if (lastPageLink.hasClass('active_link')) {
			totalPages = page;
		}
	}
	return {
		torrents,
		pagination: {
			currentPage: page,
			totalPages: totalPages,
		},
	};
};
