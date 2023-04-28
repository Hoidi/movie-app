<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import {
        GroupSortingOrder,
        averageBudget,
        averageRatingDiff,
        averageReleaseYear,
        averageRunningTime,
        averageUserRating,
        numberOfWatches,
        sortForAverageBudget,
        sortForAverageRatingDiff,
        sortForAverageReleaseYear,
        sortForAverageRunningTime,
        sortForAverageUserRating,
        sortForNumberOfWatches,
        sortForTotalBudget,
        sortForTotalRatingDiff,
        sortForTotalRunningTime,
        totalBudget,
        totalRatingDiff,
        totalRunningTime,
    } from '../sorting';
    import type { Groups, Movie } from '../types';

    export let title: string = '';
    export let groups: Groups = [];

    // move this to each page and just let this element render the list given?
    export let sortingOrder: GroupSortingOrder;

    let movieSortingFunction: (m: Movie[]) => number;

    const sort = () => {
        let groupSortingFunction: (m: Groups) => Groups;

        switch (sortingOrder) {
            case GroupSortingOrder.averageUserrating:
                groupSortingFunction = sortForAverageUserRating;
                movieSortingFunction = averageUserRating;
                break;
            case GroupSortingOrder.averageRatingDiff:
                groupSortingFunction = sortForAverageRatingDiff;
                movieSortingFunction = averageRatingDiff;
                break;
            case GroupSortingOrder.totalRatingDiff:
                groupSortingFunction = sortForTotalRatingDiff;
                movieSortingFunction = totalRatingDiff;
                break;
            case GroupSortingOrder.numberOfWatches:
                groupSortingFunction = sortForNumberOfWatches;
                movieSortingFunction = numberOfWatches;
                break;
            case GroupSortingOrder.averageRunningTime:
                groupSortingFunction = sortForAverageRunningTime;
                movieSortingFunction = averageRunningTime;
                break;
            case GroupSortingOrder.totalRunningTime:
                groupSortingFunction = sortForTotalRunningTime;
                movieSortingFunction = totalRunningTime;
                break;
            case GroupSortingOrder.averageReleaseYear:
                groupSortingFunction = sortForAverageReleaseYear;
                movieSortingFunction = averageReleaseYear;
                break;
            case GroupSortingOrder.averageBudget:
                groupSortingFunction = sortForAverageBudget;
                movieSortingFunction = averageBudget;
                break;
            case GroupSortingOrder.totalBudget:
                groupSortingFunction = sortForTotalBudget;
                movieSortingFunction = totalBudget;
                break;
            default:
                groupSortingFunction = sortForAverageUserRating;
                movieSortingFunction = averageUserRating;
        }

        groups = groupSortingFunction(groups);
    };

    sort();
</script>

<Table hoverable>
    <TableHead>
        <TableHeadCell>Place</TableHeadCell>
        <TableHeadCell>{title}</TableHeadCell>
        <TableHeadCell>Number of movies</TableHeadCell>
        <TableHeadCell>Sorting value</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each groups as group, index}
            <TableBodyRow>
                <TableBodyCell>{index + 1}</TableBodyCell>
                <TableBodyCell>{group.groupsTitle}</TableBodyCell>
                <TableBodyCell>{group.moviesInGroup.length}</TableBodyCell>
                <TableBodyCell>
                    {#if sortingOrder != GroupSortingOrder.averageRunningTime && sortingOrder != GroupSortingOrder.totalRunningTime}
                        {movieSortingFunction(group.moviesInGroup)}
                    {:else}
                        {new Date(movieSortingFunction(group.moviesInGroup))
                            .toTimeString()
                            .split(' ')[0]
                            .slice(0, 5)}
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
