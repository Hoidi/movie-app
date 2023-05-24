import { parse } from 'papaparse';
import { keyFromDiaryMovie } from '../store';
import type { DiaryEntry, DiaryMovie, WatchMoment } from '../types';
import { parseDate } from './date';

export const readCsv = async (
    content: string
): Promise<Map<string, DiaryEntry>> => {
    const getOrCreateDiaryEntry = (
        key: string,
        movie: DiaryMovie
    ): DiaryEntry => {
        const existingEntry = diary.get(key);
        if (existingEntry) {
            return existingEntry;
        }
        const newEntry = { movie: movie, watchMoments: [] };
        diary.set(key, newEntry);
        return newEntry;
    };

    // parse data with last newline removed to avoid error
    const { data, errors, _ } = await parse(content.slice(0, -1), {
        header: true,
    });

    let diary: Map<string, DiaryEntry> = new Map();

    if (errors.length > 0) {
        return new Map();
    }

    data.forEach((entry: any) => {
        const movie: DiaryMovie = {
            title: entry.Name,
            releaseYear: Number(entry.Year),
            tags: entry.Tags,
            letterboxdURI: entry['Letterboxd URI'],
            rating: Number(entry.Rating),
        };

        const watchMoment: WatchMoment = {
            dateAdded: parseDate(entry.Date),
            rewatch: entry.Rewatch === 'Yes',
            watchedDate: parseDate(entry['Watched Date']),
        };

        const key = keyFromDiaryMovie(movie);

        const diaryEntry = getOrCreateDiaryEntry(key, movie);
        diaryEntry.watchMoments.push(watchMoment);
    });

    return diary;
};
