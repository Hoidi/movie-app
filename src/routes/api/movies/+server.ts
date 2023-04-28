import { error, json } from '@sveltejs/kit';
import { searchMovie } from '../../../api/tmdb.server';
import {
    NewMovie,
    type Movie,
    type SearchMovie,
    type SearchMovieQueryBody,
} from '../../../types';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    const searchMovieQueryBody: SearchMovieQueryBody = (
        await request.json()
    ).slice(0, 30);

    searchMovieQueryBody.forEach(verifyInput);

    const movieSearchResults = await Promise.all(
        searchMovieQueryBody.map(async (searchMovieItem) =>
            searchItemToMovie(searchMovieItem)
        )
    );

    return json({ movieSearchResults });
}) satisfies RequestHandler;

const verifyInput = (searchItem: SearchMovie) => {
    if (searchItem.title == undefined) {
        throw error(418, 'Bad input');
    }

    if (searchItem.title.length > 220) {
        throw error(400, 'Too long title');
    }

    if (searchItem.releaseYear < 1800 || 2050 < searchItem.releaseYear) {
        throw error(400, 'Invalid year');
    }
};

const searchItemToMovie = async (
    searchItem: SearchMovie
): Promise<Movie | undefined> => {
    return searchMovie(searchItem.title, searchItem.releaseYear).then(
        (movieDetails) => {
            if (movieDetails) {
                return NewMovie(
                    movieDetails.id,
                    movieDetails.title,
                    Number(movieDetails.release_date.slice(0, 4)),
                    movieDetails.poster_path,
                    movieDetails.vote_average,
                    movieDetails.budget,
                    new Date(movieDetails.runtime * 60000),
                    movieDetails.production_countries.at(0)?.name || 'Unknown',
                    movieDetails.genres.map((g) => g.name),
                    searchItem.diaryEntries
                );
            }
        }
    );
};
