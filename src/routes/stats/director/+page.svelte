<script lang="ts">
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { groupedFilteringStore, movieStore } from '../../../store';
    import type { Groups, Movie } from '../../../types';

    const createGroups = (
        movies: Movie[],
        filterOutGroupsOfOne: boolean
    ): Groups => {
        const groupMap: Map<string, Movie[]> = new Map();
        const groups: Groups = [];

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

        groupMap.forEach((movies, name) => {
            const shouldAddMovies = filterOutGroupsOfOne
                ? movies.length > 1
                : true;

            if (shouldAddMovies) {
                groups.push({ groupsTitle: name, moviesInGroup: movies });
            }
        });

        return groups;
    };

    $: groups = createGroups(
        Object.values($movieStore),
        $groupedFilteringStore.filterOutGroupsOfOne
    );
</script>

{#key $groupedFilteringStore.sortingOrder}
    <GroupedMovieList title="Director" {groups} />
{/key}
