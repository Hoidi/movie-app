import { error, json } from '@sveltejs/kit';
import { searchMovie } from '../../../api/tmdb.server';
import { NewMovie } from '../../../types/movie';
import type { RequestHandler } from './$types';

// TODO: Add DiaryEntry in body in order to match it to a movie here
export type SearchMovieItem = {
    title: string;
    releaseYear: number;
};

export const POST = (async ({ request }) => {
    const body: SearchMovieItem[] = (await request.json()).movies;

    body.forEach(verifyInput);

    const movieSearchResults = await Promise.all(
        body.map(async (searchMovieItem) => searchItemToMovie(searchMovieItem))
    );

    return json({ movieSearchResults });
}) satisfies RequestHandler;

const verifyInput = (batchSearch: SearchMovieItem) => {
    if (batchSearch.title == undefined) {
        throw error(418, 'Bad input');
    }

    if (batchSearch.title.length > 220) {
        throw error(400, 'Too long title');
    }

    if (batchSearch.releaseYear < 1800 || 2050 < batchSearch.releaseYear) {
        throw error(400, 'Invalid year');
    }
};

const searchItemToMovie = async (searchItem: SearchMovieItem) => {
    return searchMovie(searchItem.title, searchItem.releaseYear).then(
        (movieDetails) => {
            if (movieDetails) {
                return NewMovie(
                    movieDetails.id,
                    movieDetails.title,
                    Number(movieDetails.release_date.slice(0, 4)),
                    movieDetails.poster_path,
                    movieDetails.vote_average,
                    movieDetails.genres.map((g) => g.name)
                );
            }
        }
    );
};
