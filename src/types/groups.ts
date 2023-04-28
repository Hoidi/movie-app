import type { Movie } from './movie';

export type Groups = {
    groupsTitle: string;
    moviesInGroup: Movie[];
}[];
