import { Transmission as TransmissionApi } from '@ctrl/transmission';
import type { TransmissionTorrent } from '../types/transmission';
import { prisma } from '../db/client';

export class Transmission {
	private api: TransmissionApi;
	private downloadDir = '';

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
		this.api = new TransmissionApi({
			baseUrl: `http://localhost:${port}`,
			username,
			password,
		});
		this.downloadDir = downloadDir;
	}

	public async addTorrent({
		url,
		paused = false,
		path = '',
		userId,
	}: {
		url: string;
		userId: number;
		paused?: boolean;
		path?: string;
	}) {
		console.log(`⚡️ — Adding torrent: ${url}`);
		const downloadDir = `${this.downloadDir}/${path}`;
		const {
			arguments: {
				'torrent-added': { hashString, id, name },
			},
		} = await this.api.addUrl(url, {
			paused,
			'download-dir': downloadDir,
		});
		await prisma.torrent.create({
			data: {
				hashString,
				transmissionId: id,
				name,
				path: downloadDir,
				userId,
			},
		});
		console.log(`⚡️ — Torrent added: ${url}\n`);
	}

	public async getTorrents(): Promise<TransmissionTorrent[]> {
		const { torrents } = await this.api.getAllData();
		return torrents;
	}
}
