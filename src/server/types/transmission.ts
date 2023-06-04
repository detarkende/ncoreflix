export type TransmissionTorrent = {
	id: number;
	status: keyof typeof TorrentStatus;
	name: string;
	isFinished: boolean;
	isStalled: boolean;
	percentDone: number;
	percentComplete: number;
};

export const TorrentStatus = {
	0: 'STOPPED',
	1: 'VERIFY_WAIT',
	2: 'VERIFY',
	3: 'DOWNLOAD_WAIT',
	4: 'DOWNLOAD',
	5: 'SEED_WAIT',
	6: 'SEED',
} as const;
