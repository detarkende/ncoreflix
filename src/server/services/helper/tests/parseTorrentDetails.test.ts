import { parseTorrentDetails } from '../parseTorrentDetails';
import fs from 'fs';
import { torrentArraySchema } from '@/server/types/ncore';

describe('parseTorrentDetails', () => {
	describe('No torrents found', () => {
		const html = fs.readFileSync(
			'src/server/services/helper/tests/mocks/parseTorrentDetails/noTorrents.html',
			'utf-8',
		);
		it(`GIVEN: html with no torrents
            THEN: the returned torrents is an empty array`, () => {
			const { torrents } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});

			expect(torrents).toEqual([]);
		});
		it(`GIVEN: html with no torrents
            THEN: the returned pagination.totalPages is 1`, () => {
			const { pagination } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});

			expect(pagination).toEqual({
				currentPage: 1,
				totalPages: 1,
			});
		});
	});

	describe('1 page of torrents found', () => {
		const html = fs.readFileSync(
			'src/server/services/helper/tests/mocks/parseTorrentDetails/onePageOfTorrents.html',
			'utf-8',
		);
		it(`GIVEN: html with 1 page and 11 torrents
            THEN: the returned torrents array is 11 entries long`, () => {
			const { torrents } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});
			expect(torrents.length).toEqual(11);
			const { success } = torrentArraySchema.safeParse(torrents);
			expect(success).toEqual(true);
		});
		it(`GIVEN: html with 1 page of torrents
            THEN: the returned pagination.totalPages is 1`, () => {
			const { pagination } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});

			expect(pagination).toEqual({
				currentPage: 1,
				totalPages: 1,
			});
		});
	});

	describe('multiple pages of torrents found', () => {
		const html = fs.readFileSync(
			'src/server/services/helper/tests/mocks/parseTorrentDetails/twoPagesOfTorrents.html',
			'utf-8',
		);
		it(`GIVEN: html with 2 pages
            THEN: the returned torrents array is 25 entries long`, () => {
			const { torrents } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});

			expect(torrents.length).toEqual(25);
			const { success } = torrentArraySchema.safeParse(torrents);
			expect(success).toEqual(true);
		});
		it(`GIVEN: html with 1 page of torrents
            THEN: the returned pagination.totalPages is 1`, () => {
			const { pagination } = parseTorrentDetails({
				html,
				imdbId: 'tt123',
				page: 1,
			});

			expect(pagination).toEqual({
				currentPage: 1,
				totalPages: 2,
			});
		});
	});
});
