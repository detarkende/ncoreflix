declare module 'rip-subtitles' {
	import type internal from 'stream';
	function extract(
		str: string,
		cb?: (err: Error | undefined, subtitles: string[]) => unknown,
	): internal.Transform;
	export default extract;
}
