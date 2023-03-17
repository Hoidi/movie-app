import { searchMovie } from '../../api/tmdb.server';
import { NewMovie } from '../../types/movie';
import type { PageServerLoad } from './$types';

const moviesList = [
    { title: 'Babylon', releaseYear: 2022 },
    { title: 'Joker', releaseYear: 2019 },
    { title: 'A trip to the moon', releaseYear: 1902 },
    { title: 'Dune', releaseYear: 2021 },
    { title: 'Passengers', releaseYear: 2016 },
];

export const load = (async ({}) => {
    const fetchMovies = async () => {
        return moviesList.map(async (diary) => {
            return searchMovie(diary.title, diary.releaseYear).then(
                (movieDetails) => {
                    if (movieDetails) {
                        return NewMovie(
                            movieDetails.id,
                            movieDetails.title,
                            Number(movieDetails.release_date.slice(0, 4)),
                            movieDetails.poster_path,
                            movieDetails.vote_average
                        );
                    }
                }
            );
        });
    };

    return {
        myMoviesFetch: fetchMovies(),
    };
}) satisfies PageServerLoad;
