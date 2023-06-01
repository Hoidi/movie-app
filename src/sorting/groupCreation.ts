import type { Groups, Movie } from '../types';

export const addGroupToList = (
    groupMap: Map<string, Movie[]>,
    filterOutGroupsOfOne: boolean
): Groups => {
    const groups: Groups = [];

    groupMap.forEach((movies, name) => {
        const shouldAddMovies = filterOutGroupsOfOne ? movies.length > 1 : true;

        if (shouldAddMovies) {
            groups.push({ groupsTitle: name, moviesInGroup: movies });
        }
    });

    return groups;
};

export const createDirectorGroups = (
    movies: Movie[],
    filterOutGroupsOfOne: boolean
): Groups => {
    const groupMap: Map<string, Movie[]> = new Map();

    movies.forEach((movie) => {
        const director = movie.crew.find(
            (crew) => crew.job.job === 'Director'
        )?.person;

        if (director) {
            if (!groupMap.has(director.name)) {
                groupMap.set(director.name, []);
            }
            groupMap.get(director.name)?.push(movie);
        } else {
            if (!groupMap.has('Unknown')) {
                groupMap.set('Unknown', []);
            }
            groupMap.get('Unknown')?.push(movie);
        }
    });

    return addGroupToList(groupMap, filterOutGroupsOfOne);
};

export const createCountryGroups = (
    movies: Movie[],
    filterOutGroupsOfOne: boolean
): Groups => {
    const groupMap: Map<string, Movie[]> = new Map();

    movies.forEach((movie) => {
        const country = movie.countryOfOrigin;

        if (!groupMap.has(country)) {
            groupMap.set(country, []);
        }
        groupMap.get(country)?.push(movie);
    });

    return addGroupToList(groupMap, filterOutGroupsOfOne);
};

export const createActorGroups = (
    movies: Movie[],
    filterOutGroupsOfOne: boolean
): Groups => {
    const groupMap: Map<string, Movie[]> = new Map();

    movies.forEach((movie) => {
        movie.cast.forEach((actor) => {
            if (!groupMap.has(actor.person.name)) {
                groupMap.set(actor.person.name, []);
            }
            groupMap.get(actor.person.name)?.push(movie);
        });
    });

    return addGroupToList(groupMap, filterOutGroupsOfOne);
};

export const createGenreGroups = (
    movies: Movie[],
    filterOutGroupsOfOne: boolean
): Groups => {
    const groupMap: Map<string, Movie[]> = new Map();

    movies.forEach((movie) => {
        movie.genres.forEach((genre) => {
            if (!groupMap.has(genre)) {
                groupMap.set(genre, []);
            }
            groupMap.get(genre)?.push(movie);
        });
    });

    return addGroupToList(groupMap, filterOutGroupsOfOne);
};
