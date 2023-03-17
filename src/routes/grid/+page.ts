import { diaryStore } from '../../store/diary';
import type { DiaryEntry } from '../../types/diary';
import type { Movie } from '../../types/movie';
import type { SearchItem } from '../api/movies/+server';
import type { PageLoad } from './$types';

let diary: DiaryEntry[] = [];

diaryStore.subscribe((storedDiary) => {
    diary = storedDiary;
});

export const load = (async ({ fetch }) => {
    if (!diary) {
        return [];
    }

    const searchItems: SearchItem[] = diary.map((diaryEntry) => ({
        title: diaryEntry.title,
        releaseYear: diaryEntry.releaseYear,
    }));

    const body = {
        movies: searchItems.slice(0, 10),
    };

    const searchResults: Promise<Movie[]> = fetch('/api/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json.searchResults;
        });

    return {
        response: searchResults,
    };
}) satisfies PageLoad;
