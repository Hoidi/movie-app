import type { Person } from './person';

export type Movie = {
    id: number;
    title: string;
    releaseYear: number;
    posterPath: string;
    voteAverage: number;
    genres: string[];
    cast: Person[];
    crew: Person[];
};

export function NewMovie(
    id: number,
    title: string,
    releaseYear: number,
    posterPath: string,
    voteAverage: number,
    genres: string[]
): Movie {
    return {
        id: id,
        title: title,
        releaseYear: releaseYear,
        posterPath: posterPath,
        voteAverage: voteAverage,
        genres: genres,
        cast: [],
        crew: [],
    };
}
