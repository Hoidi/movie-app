<script lang="ts">
    import { Alert, Select } from 'flowbite-svelte';
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { GroupSortingOrder, groupSortingOrders } from '../../../sorting';
    import { movieStore } from '../../../store';
    import type { Groups, Movie } from '../../../types';

    let sortingOrder = GroupSortingOrder.averageReleaseYear;

    const createGroups = (movies: Movie[]): Groups => {
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

        groupMap.forEach((movies, name) =>
            groups.push({ groupsTitle: name, moviesInGroup: movies })
        );

        return groups;
    };

    const groups = createGroups(Object.values($movieStore));
</script>

<Select class="mt-2" items={groupSortingOrders} bind:value={sortingOrder} />

{#if Object.values($movieStore).length === 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <a href="/upload">here</a> and try again.
        </Alert>
    </div>
{:else}
    {#key sortingOrder}
        <GroupedMovieList title="Director" {groups} {sortingOrder} />
    {/key}
{/if}
