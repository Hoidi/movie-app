import type { Groups, Movie } from '../types';
import { addGroupToList } from './groupCreation';

const getYear = (date: Date): string => {
    return String(date.getFullYear());
};

const getYearMonth = (date: Date): string => {
    return date.getFullYear() + '-' + date.getMonth();
};

const getYearMonthDay = (date: Date): string => {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
};

export const createTimePeriodGroups = (
    movies: Movie[],
    keyFunction: (date: Date) => string
): Groups => {
    const groupMap: Map<string, Movie[]> = new Map();

    movies.forEach((movie) => {
        movie.diaryEntries.watchMoments.forEach((watchMoment) => {
            const timePeriod = keyFunction(watchMoment.watchedDate);

            if (!groupMap.has(timePeriod)) {
                groupMap.set(timePeriod, []);
            }

            groupMap.get(timePeriod)?.push(movie);
        });
    });

    return addGroupToList(groupMap, false);
};

export const createYearGroups = (movies: Movie[]): Groups => {
    return createTimePeriodGroups(movies, getYear);
};

export const createMonthGroups = (movies: Movie[]): Groups => {
    return createTimePeriodGroups(movies, getYearMonth);
};

export const createDayGroups = (movies: Movie[]): Groups => {
    return createTimePeriodGroups(movies, getYearMonthDay);
};
