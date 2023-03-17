import { error, json } from '@sveltejs/kit';
import { searchMovie } from '../../../api/tmdb.server';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
    const title = url.searchParams.get('title') || undefined;
    const releaseYear = Number(url.searchParams.get('releaseYear') ?? -1);

    if (title == undefined || releaseYear === -1) {
        throw error(418, 'Bad input');
    }

    if (title.length > 220) {
        throw error(400, 'Too long title');
    }

    if (releaseYear < 1800 || 2050 < releaseYear) {
        throw error(400, 'Invalid year');
    }

    return json(await searchMovie(title, releaseYear));
}) satisfies RequestHandler;
