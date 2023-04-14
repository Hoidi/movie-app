import type { Movie, SearchMovieQueryBody } from '../types';

export const searchMovies = async (
    searchItems: SearchMovieQueryBody
): Promise<Movie[]> => {
    if (searchItems.length === 0) {
        console.log('no need to fetch movies');
        return Promise.resolve([]);
    }

    searchItems = searchItems.slice(0, 5);

    return fetch('/api/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchItems),
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json.movieSearchResults;
        });
};
