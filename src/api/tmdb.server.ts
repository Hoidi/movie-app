import { SECRET_TMDB_ACCESS_TOKEN } from '$env/static/private';
import TMDB, {
    type Credits,
    type Movie,
    type MovieDetails,
    type PersonDetail,
    type Search,
    type TV,
    type TvShowDetails,
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

async function getSerie(id: number): Promise<TvShowDetails | undefined> {
    try {
        const serie = await tmdb.tvShows.details(id);

        if (serie != undefined) {
            return serie;
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

        const movie = findMovieWithDiff(movies, title, releaseYear, 0);

        if (movie != undefined) {
            return await getMovie(movie.id);
        }

        // sometimes the release year differes by one
        const movieSecond = findMovieWithDiff(movies, title, releaseYear, 1);

        if (movieSecond != undefined) {
            return await getMovie(movieSecond.id);
        }

        /*const series = await tmdb.search.tvShows({
            query: title,
            first_air_date_year: releaseYear,
        });

        const serie = findSerieWithDiff(series, title, releaseYear, 0);

        if (serie != undefined) {
            return await getSerie(serie.id);
        }

        // sometimes the release year differes by one
        const seriesSecond = findSerieWithDiff(series, title, releaseYear, 1);

        if (seriesSecond != undefined) {
            return await getSerie(seriesSecond.id);
        }*/
    } catch (err) {
        return undefined;
    }
}

function between(value: number, first: number, last: number) {
    let lower = Math.min(first, last),
        upper = Math.max(first, last);
    return value >= lower && value <= upper;
}

const findMovieWithDiff = (
    searchResults: Search<Movie>,
    title: string,
    releaseYear: number,
    diff: number
): Movie | undefined => {
    return searchResults.results.find((movie) => {
        const movieYear = Number(movie.release_date.slice(0, 4));
        return (
            between(movieYear, releaseYear - diff, releaseYear + diff) &&
            movie.title.toLowerCase() === title.toLowerCase()
        );
    });
};

const findSerieWithDiff = (
    searchResults: Search<TV>,
    title: string,
    releaseYear: number,
    diff: number
): TV | undefined => {
    return searchResults.results.find((series) => {
        const seriesYear = Number(series.first_air_date.slice(0, 4));
        return (
            between(seriesYear, releaseYear - diff, releaseYear + diff) &&
            series.name.toLowerCase() === title.toLowerCase()
        );
    });
};
