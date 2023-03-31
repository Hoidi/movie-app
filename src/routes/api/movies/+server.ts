import { error, json } from '@sveltejs/kit';
import { searchMovie } from '../../../api/tmdb.server';
import { NewMovie } from '../../../types/movie';
import type { RequestHandler } from './$types';

export type SearchItem = {
    title: string;
    releaseYear: number;
};

export const POST = (async ({ request }) => {
    const body: SearchItem[] = (await request.json()).movies;

    body.forEach(verifyInput);

    const searchResults = await Promise.all(
        body.map(async (search) =>
            searchMovie(search.title, search.releaseYear).then(
                (movieDetails) => {
                    if (movieDetails) {
                        return NewMovie(
                            movieDetails.id,
                            movieDetails.title,
                            Number(movieDetails.release_date.slice(0, 4)),
                            movieDetails.poster_path,
                            movieDetails.vote_average,
                            movieDetails.genres.map(g => g.name)
                        );
                    }
                }
            )
        )
    );

    return json({ searchResults });
}) satisfies RequestHandler;

const verifyInput = (batchSearch: SearchItem) => {
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
