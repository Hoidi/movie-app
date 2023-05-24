<script lang="ts">
    import { Alert, Select, Toggle } from 'flowbite-svelte';
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { GroupSortingOrder, groupSortingOrders } from '../../../sorting';
    import { movieStore } from '../../../store';
    import type { Groups, Movie } from '../../../types';

    let sortingOrder = GroupSortingOrder.averageReleaseYear;

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

    $: groups = createGroups(Object.values($movieStore), filterOutGroupsOfOne);

    export let filterOutGroupsOfOne: boolean = true;
</script>

<div class="content">
    <div class="filtering">
        <div class="toggle">
            <Toggle bind:checked={filterOutGroupsOfOne}
                >Ignore results of only one movie</Toggle
            >
        </div>
        <div class="select">
            <Select
                class="mt-2"
                items={groupSortingOrders}
                bind:value={sortingOrder}
            />
        </div>
    </div>

    <div class="list">
        {#if Object.values($movieStore).length === 0}
            <div style="margin-top: 50px;">
                <Alert color="yellow">
                    <span class="font-medium">No diary available. </span> Upload
                    your diary <a href="/upload">here</a> and try again.
                </Alert>
            </div>
        {:else}
            {#key filterOutGroupsOfOne}
                {#key sortingOrder}
                    <GroupedMovieList
                        title="Director"
                        {groups}
                        {sortingOrder}
                    />
                {/key}
            {/key}
        {/if}
    </div>
</div>

<style>
    .content {
        width: min(100%, 1400px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
    }

    .filtering {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        order: 2;
        height: fit-content;
        width: fit-content;
        width: 30%;
    }

    .list {
        margin-right: 20px;
        width: 70%;
    }

    .toggle {
        height: fit-content;
        width: 260px;
        align-self: center;
    }

    .select {
        height: fit-content;
        align-self: center;
    }

    @media (max-width: 1000px) {
        .content {
            flex-direction: column;
        }

        .filtering {
            flex-direction: row;
            justify-content: space-evenly;
            order: 1;
            width: 100%;
            margin-bottom: 20px;
        }

        .list {
            order: 2;
            width: 100%;
        }
    }
</style>
