import type { Groups, Movie } from '../types';
import { addGroupToList } from './groupCreation';

const getYear = (date: Date): string => {
    date = new Date(date);
    return String(date.getFullYear());
};

const getYearMonth = (date: Date): string => {
    date = new Date(date);
    return date.getFullYear() + '-' + getMonthWithLeading0(date);
};

const getYearMonthDay = (date: Date): string => {
    date = new Date(date);
    return (
        date.getFullYear() +
        '-' +
        getMonthWithLeading0(date) +
        '-' +
        getDayWithLeading0(date)
    );
};

const getMonthWithLeading0 = (date: Date): string => {
    const month = date.getMonth() + 1; // January is month 0, so we add 1

    if (month < 10) {
        return `0${month}`;
    }

    return String(month);
};

const getDayWithLeading0 = (date: Date): string => {
    const day = date.getDate();

    if (day < 10) {
        return `0${day}`;
    }

    return String(day);
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
