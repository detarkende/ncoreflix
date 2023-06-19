import { load } from 'cheerio';
import FormData from 'form-data';
import type { PaginationDetails, Torrent } from './types';
import { parseTorrentDetails } from '@/server/services/ncore/helper/parseTorrentDetails';
import { fetchBuilder, MemoryCache } from 'node-fetch-cache';

const cache = new MemoryCache({ ttl: 30_000 });
const cachedFetch = fetchBuilder.withCache(cache);

export class Ncore {
	cookies = new Set<string>([]);
	private url: string;
	private username: string;
	private password: string;

	constructor({
		url,
		username,
		password,
	}: {
		url: string;
		username: string;
		password: string;
	}) {
		this.url = url;
		this.username = username;
		this.password = password;
	}

	public async getTorrents({
		imdbId,
		type,
		page,
	}: {
		imdbId: string;
		type: 'movie' | 'tv';
		page: number;
	}): Promise<{ torrents: Torrent[]; pagination: PaginationDetails }> {
		console.log(
			`🔍 — Searching for torrents: Category: ${type}. ID: ${imdbId}.`,
		);
		await this.checkLoginExpiration();

		const ncoreParams = new URLSearchParams({
			mire: imdbId,
			miben: 'imdb',
			tipus: 'all',
			oldal: `${page}`,
		}).toString();
		const ncoreResponse = await cachedFetch(
			`${this.url}/torrents.php?${ncoreParams}`,
			{
				headers: {
					Cookie: [...this.cookies].join('; '),
				},
			},
		);

		const ncoreData = await ncoreResponse.text();
		const { torrents, pagination } = parseTorrentDetails({
			html: ncoreData,
			imdbId,
			page,
		});

		console.log(`📝 — Found ${torrents.length} torrents\n`);
		return { torrents, pagination };
	}

	public async getTorrentDownloadLink({ url }: { url: string }) {
		console.log(`🔍 — Searching for torrent download link: ${url}`);
		await this.checkLoginExpiration();

		const ncoreResponse = await cachedFetch(`${this.url}/${url}`, {
			headers: {
				Cookie: [...this.cookies].join('; '),
			},
		});
		const ncoreData = await ncoreResponse.text();
		const $ = load(ncoreData);
		const downloadPath: string | undefined =
			$('.download > a').attr('href');
		if (!downloadPath) throw Error('No download url found');

		const downloadLink = `${this.url}/${downloadPath}`;

		console.log(`📝 — Found download link: ${downloadLink}\n`);
		return downloadLink;
	}

	/**
	 * Logs in to nCore and saves the cookies.
	 */
	public async login() {
		console.log('👤 — Logging in to nCore...');
		this.cookies.clear();
		const form = new FormData();
		form.append('set_lang', 'hu');
		form.append('submitted', '1');
		form.append('nev', this.username);
		form.append('pass', this.password);
		form.append('ne_leptessen_ki', '1');
		return new Promise<void>((resolve, reject) => {
			form.submit(`${this.url}/login.php`, (err, res) => {
				if (err) reject(err);
				res.headers['set-cookie']?.forEach((cookieString) => {
					this.cookies.add(cookieString);
				});
				return resolve();
			});
		});
	}

	/**
	 * Checks if the login cookie is expired and if it is, it logs in again.
	 */
	async checkLoginExpiration() {
		let smallestExpirationDate = Date.now() + 1000 * 60 * 60 * 24 * 1000; // 1000 days from now
		if (this.cookies.size === 0) {
			await this.login();
		}
		const fullCookieString = [...this.cookies].join('; ');
		const expirationDates = fullCookieString.matchAll(/expires=([^;]+)/g);
		Array.from(expirationDates).forEach((match) => {
			if (match[1]) {
				const expirationDate = new Date(match[1]);
				if (expirationDate.getTime() < smallestExpirationDate) {
					smallestExpirationDate = expirationDate.getTime();
				}
			}
		});
		if (smallestExpirationDate < Date.now() + 1000) {
			await this.login();
		}
	}
}
