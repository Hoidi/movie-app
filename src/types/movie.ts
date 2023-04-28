import type { DiaryEntry } from './diary';

export type Movie = {
    id: number;
    title: string;
    releaseYear: number;
    posterPath: string;
    voteAverage: number;
    budgetInUsd: number;
    runningTime: Date;
    countryOfOrigin: string;
    genres: string[];
    diaryEntries: DiaryEntry;
    cast: number[];
    crew: number[];
};

export function NewMovie(
    id: number,
    title: string,
    releaseYear: number,
    posterPath: string,
    voteAverage: number,
    budgetInUsd: number,
    runningTime: Date,
    countryOfOrigin: string,
    genres: string[],
    diaryEntries: DiaryEntry
): Movie {
    return {
        id: id,
        title: title,
        releaseYear: releaseYear,
        posterPath: posterPath,
        voteAverage: voteAverage,
        budgetInUsd: budgetInUsd,
        runningTime: runningTime,
        countryOfOrigin: countryOfOrigin,
        genres: genres,
        diaryEntries: diaryEntries,
        cast: [],
        crew: [],
    };
}
