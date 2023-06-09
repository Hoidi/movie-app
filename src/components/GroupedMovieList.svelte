<script lang="ts">
    import { PUBLIC_MOVIE_URL } from '$env/static/public';
    import {
        A,
        Popover,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import {
        GroupSortingOrder,
        alphabetically,
        averageBudget,
        averageRatingDiff,
        averageReleaseYear,
        averageRunningTime,
        averageUserRating,
        groupSortingOrders,
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
    import { groupedFilteringStore } from '../store';
    import type { Groups, Movie } from '../types';
    import SortingValue from './SortingValue.svelte';

    export let title: string = '';
    export let groups: Groups = [];

    // move this to each page and just let this element render the list given?
    let sortingOrder = $groupedFilteringStore.sortingOrder;
    $: groupSortingItem =
        groupSortingOrders.find((sorting) => sorting.value === sortingOrder) ??
        groupSortingOrders[0];

    let movieSortingFunction: (m: Movie[]) => number;

    let groupSortingFunction: (m: Groups) => Groups;
    switch (sortingOrder) {
        case GroupSortingOrder.averageUserRating:
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

                <TableBodyCell
                    ><div id={group.groupsTitle.replaceAll(/\W/g, '')}>
                        {group.moviesInGroup.length}
                    </div>
                    <Popover
                        triggeredBy="#{group.groupsTitle.replaceAll(/\W/g, '')}"
                        >{#each group.moviesInGroup.sort(alphabetically) as movie}
                            <A
                                target="_blank"
                                href={PUBLIC_MOVIE_URL + movie.id}
                                >{movie.title}</A
                            >

                            <br />
                        {/each}</Popover
                    ></TableBodyCell
                >

                <TableBodyCell>
                    <SortingValue
                        value={groupSortingItem.displayFunction(
                            movieSortingFunction(group.moviesInGroup)
                        )}
                        component={groupSortingItem.component}
                    />
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
