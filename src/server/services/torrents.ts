import { load } from 'cheerio';
import type { TransmissionTorrent } from '../types/transmission';

export class Transmission {
	private url = '';
	private sessionId = '';
	private downloadDir = '';
	private authString = '';

	constructor({
		port,
		downloadDir,
		username,
		password,
	}: {
		port: string;
		downloadDir: string;
		username: string;
		password: string;
	}) {
		this.url = `http://localhost:${port}/transmission/rpc`;
		this.downloadDir = downloadDir;
		this.sessionId = '';
		this.authString = btoa(`${username}:${password}`);
		void this.setSessionId();
	}

	/**
	 * Adds a torrent to the transmission client
	 */
	public async addTorrent({
		url,
		paused = false,
	}: {
		url: string;
		paused?: boolean;
	}): Promise<void> {
		console.log(`⚡️ — Adding torrent: ${url}`);

		const response = await fetch(this.url, {
			method: 'POST',
			body: JSON.stringify({
				method: 'torrent-add',
				arguments: {
					paused,
					downloadDir: this.downloadDir,
					filename: url,
				},
			}),
			headers: {
				'Content-Type': 'application/json',
				'x-transmission-session-id': this.sessionId,
				Authorization: `Basic ${this.authString}`,
			},
		});

		if (response.status === 409) {
			console.warn(`⚡️ — Session expired, renewing...`);
			await this.setSessionId();
			await this.addTorrent({ url, paused });
			return;
		}
		console.log(`⚡️ — Torrent added: ${url}\n`);
		return response.json();
	}

	/**
	 * Gets the list of added torrents
	 */
	public async getTorrents(): Promise<TransmissionTorrent[]> {
		await this.setSessionId();
		const response = await fetch(this.url, {
			method: 'POST',
			body: JSON.stringify({
				method: 'torrent-get',
				arguments: {
					fields: [
						'id',
						'name',
						'status',
						'isFinished',
						'isStalled',
						'percentDone',
						'percentComplete',
					],
				},
			}),
			headers: {
				'Content-Type': 'application/json',
				'x-transmission-session-id': this.sessionId,
				Authorization: `Basic ${this.authString}`,
			},
		});
		const {
			arguments: { torrents },
		} = await response.json();
		return torrents as TransmissionTorrent[];
	}

	private async setSessionId() {
		try {
			const response = await fetch(this.url, {
				method: 'POST',
				body: JSON.stringify({
					method: 'session-get',
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${this.authString}`,
				},
			});
			if (response.status === 409) {
				const sessionId =
					response.headers.get('x-transmission-session-id') ?? '';
				this.sessionId = sessionId;
			}
		} catch (e) {
			console.error(e);
		}
	}

	public async getSessionId(): Promise<string> {
		await this.setSessionId();
		return this.sessionId;
	}
}
