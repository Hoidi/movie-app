import { persisted } from 'svelte-local-storage-store';
import type { Movie } from '../types/movie';

export type MovieIdMap = Record<number, Movie>;

let initial: MovieIdMap = {};

function createMovies() {
    const { subscribe, set, update } = persisted('movies', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        upsert: (movie: Movie) => {
            update((record) => ({ ...record, [movie.id]: movie }));
        },
        upsertFromList: (movies: (Movie | undefined)[]) => {
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
