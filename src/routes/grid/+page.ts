import { diaryStore } from '../../store/diary';
import { movieStore } from '../../store/movies';
import type { DiaryEntry } from '../../types/diary';
import type { Movie } from '../../types/movie';
import type { SearchItem } from '../api/movies/+server';
import type { PageLoad } from './$types';

let diary: DiaryEntry[] = [];

type Fetch = (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
) => Promise<Response>;

diaryStore.subscribe((storedDiary) => {
    diary = storedDiary;
});

const movies: Set<SearchItem> = new Set();

movieStore.subscribe((storedMovies) => {
    let movieList = Object.values(storedMovies);

    movies.clear();

    movieList.forEach((movie) =>
        movies.add({
            title: movie.title,
            releaseYear: movie.releaseYear,
        })
    );
});

export const load = (async ({ fetch }) => {
    if (!diary)
        return {
            response: [],
        };

    const searchItems: SearchItem[] = filterMovieBasedOnAlreadyFetchedMovies();

    const searchResults = searchMovies(searchItems, fetch);

    return {
        response: searchResults,
    };
}) satisfies PageLoad;

const filterMovieBasedOnAlreadyFetchedMovies = (): SearchItem[] => {
    const searchItems: SearchItem[] = [];

    diary.forEach((diaryEntry) => {
        const searchItem: SearchItem = {
            title: diaryEntry.title,
            releaseYear: diaryEntry.releaseYear,
        };

        if (!movies.has(searchItem)) {
            searchItems.push(searchItem);
        }
    });

    return searchItems.slice(0, 30);
};

const searchMovies = async (
    searchItems: SearchItem[],
    fetch: Fetch
): Promise<Movie[]> => {
    if (searchItems.length === 0) {
        console.log('no need to fetch movies');
        return Promise.resolve([]);
    }

    const body = {
        movies: searchItems.slice(0, 30),
    };

    return fetch('/api/movies', {
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
};
