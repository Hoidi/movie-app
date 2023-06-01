import type { Movie } from '../types';

export const averageUserRating = (movies: Movie[]): number => {
    return averageNumber(
        movies.map((movie) => movie.diaryEntries.movie.rating)
    );
};

export const totalRatingDiff = (movies: Movie[]): number => {
    return totalNumber(
        movies.map((movie) =>
            Math.abs(movie.voteAverage / 2 - movie.diaryEntries.movie.rating)
        )
    );
};

export const averageRatingDiff = (movies: Movie[]): number => {
    return averageNumber(
        movies.map((movie) =>
            Math.abs(movie.voteAverage / 2 - movie.diaryEntries.movie.rating)
        )
    );
};

export const numberOfWatches = (movies: Movie[]): number => {
    return totalNumber(
        movies.map((movie) => movie.diaryEntries.watchMoments.length)
    );
};

export const averageRunningTime = (movies: Movie[]): number => {
    return averageNumber(
        // TODO: Why is running time a string here?
        movies.map((movie) => new Date(movie.runningTime).getTime())
    );
};

export const totalRunningTime = (movies: Movie[]): number => {
    return totalNumber(
        // TODO: Why is running time a string here?
        movies.map((movie) => new Date(movie.runningTime).getTime())
    );
};

export const averageReleaseYear = (movies: Movie[]): number => {
    return averageNumber(movies.map((movie) => movie.releaseYear));
};

export const averageBudget = (movies: Movie[]): number => {
    return averageNumber(movies.map((movie) => movie.budgetInUsd));
};

export const totalBudget = (movies: Movie[]): number => {
    return totalNumber(movies.map((movie) => movie.budgetInUsd));
};

export const totalNumber = (numbers: number[]): number => {
    return numbers.reduce((total, number) => number + total, 0);
};

export const averageNumber = (numbers: number[]): number => {
    let size = -1;
    return numbers.reduce((average, number) => {
        size++;
        return (size * average + number) / (size + 1);
    }, 0);
};
