import type { DiaryEntry } from './diary';

// TODO: Add DiaryEntry in body in order to match it to a movie here
export type SearchMovie = {
    title: string;
    releaseYear: number;
    diaryEntries: DiaryEntry;
};

export type SearchMovieQueryBody = SearchMovie[];

export type MovieIdsQueryBody = {
    movieIds: number[];
};
