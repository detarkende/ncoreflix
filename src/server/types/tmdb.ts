import type { paths } from 'tmdb';

type ItemOfArray<T> = T extends Array<infer U> ? U : never;

export interface MultiSearchResult
	extends ItemOfArray<
		paths['/3/search/multi']['get']['responses']['200']['content']['application/json']['results']
	> {
	name?: string;
	original_name?: string;
}

export type Movie =
	paths['/3/movie/{movie_id}']['get']['responses']['200']['content']['application/json'];
export type TVShow =
	paths['/3/tv/{series_id}']['get']['responses']['200']['content']['application/json'];

export type Media = {
	title: string;
	description: string;
	release: string;
	rating: number | null;
	poster: string | null;
	backdrop: string | null;
	genres: string[];
	type: 'movie' | 'tv';
	imdbId: string | null;
};
