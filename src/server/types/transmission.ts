import type { Transmission as TransmissionApi } from '@ctrl/transmission';

export type TransmissionTorrent = Awaited<
	ReturnType<TransmissionApi['getAllData']>
>['torrents'][number];

export enum TorrentState {
	downloading = 'downloading',
	seeding = 'seeding',
	paused = 'paused',
	queued = 'queued',
	checking = 'checking',
	warning = 'warning',
	error = 'error',
	unknown = 'unknown',
}

export const isDownloadingState = (state: TorrentState): boolean => {
	return [
		TorrentState.checking,
		TorrentState.downloading,
		TorrentState.queued,
		TorrentState.paused,
		TorrentState.unknown,
	].includes(state);
};

export const isDownloadDoneState = (state: TorrentState): boolean => {
	return state === TorrentState.seeding;
};
