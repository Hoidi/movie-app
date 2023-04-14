import type { SearchMovieItem } from '../routes/api/movies/+server';
import type { Movie } from '../types/movie';

export const searchMovies = async (
    searchItems: SearchMovieItem[]
): Promise<Movie[]> => {
    if (searchItems.length === 0) {
        console.log('no need to fetch movies');
        return Promise.resolve([]);
    }

    const body = {
        movies: searchItems.slice(0, 5),
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
            return json.movieSearchResults;
        });
};
