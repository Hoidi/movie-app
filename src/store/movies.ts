import { persisted } from 'svelte-local-storage-store';
import type { DiaryMovie, Movie } from '../types';

export type MovieIdMap = Record<number, Movie>;

let initial: MovieIdMap = {};

export const keyFromDiaryMovie = (movie: DiaryMovie) => {
    return `${movie.title}-${movie.releaseYear}`;
};

function createMovies() {
    const { subscribe, set, update } = persisted('movies', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        set,
        upsert: (movie: Movie) => {
            update((record) => ({ ...record, [movie.id]: movie }));
        },
        upsertList: (movies: Movie[]) => {
            const record: MovieIdMap = {};

            movies.forEach((movie) => {
                if (movie) {
                    record[movie.id] = movie;
                }
            });

            set(record);
        },
        upsertFromPromiseList: async (movieTypePromises: Promise<Movie>[]) => {
            const movies = await Promise.all(movieTypePromises);

            const record: MovieIdMap = {};

            movies.forEach((movie) => {
                if (movie) {
                    record[movie.id] = movie;
                }
            });

            set(record);
        },
        reset: () => set(initial),
    };
}

export const movieStore = createMovies();
