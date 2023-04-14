import { SECRET_TMDB_ACCESS_TOKEN } from '$env/static/private';
import TMDB, {
    type Credits,
    type MovieDetails,
    type PersonDetail,
} from 'tmdb-ts';

const tmdb = new TMDB(SECRET_TMDB_ACCESS_TOKEN);

export async function getMovie(id: number): Promise<MovieDetails | undefined> {
    try {
        const movie = await tmdb.movies.details(id);

        if (movie != undefined) {
            return movie;
        }
    } catch (err) {
        return undefined;
    }
}

export async function getPerson(id: number): Promise<PersonDetail | undefined> {
    try {
        const credits = await tmdb.people.details(id);

        if (credits != undefined) {
            return credits;
        }
    } catch (err) {
        return undefined;
    }
}

export async function getCredits(id: number): Promise<Credits | undefined> {
    try {
        const credits = await tmdb.movies.credits(id);

        if (credits != undefined) {
            return credits;
        }
    } catch (err) {
        return undefined;
    }
}

export async function searchMovie(
    title: string,
    releaseYear: number
): Promise<MovieDetails | undefined> {
    try {
        const movies = await tmdb.search.movies({
            query: title,
            year: releaseYear,
        });

        const movie = movies.results.find((movie) => {
            const movieYearString = movie.release_date.slice(0, 4);
            const movieYearNumber = Number(movieYearString);
            return (
                movieYearNumber === releaseYear &&
                movie.title.toLowerCase() === title.toLowerCase()
            );
        });

        if (movie != undefined) {
            return await getMovie(movie.id);
        }

        // sometimes the release year differes by one
        const movieSecond = movies.results.find((movie) => {
            const movieYearString = movie.release_date.slice(0, 4);
            const movieYearNumber = Number(movieYearString);
            return (
                between(movieYearNumber, releaseYear - 1, releaseYear + 1) &&
                movie.title.toLowerCase() === title.toLowerCase()
            );
        });

        if (movieSecond != undefined) {
            return await getMovie(movieSecond.id);
        }
    } catch (err) {
        return undefined;
    }
}

function between(value: number, first: number, last: number) {
    let lower = Math.min(first, last),
        upper = Math.max(first, last);
    return value >= lower && value <= upper;
}
