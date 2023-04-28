<script context="module" lang="ts">
    export type Groups = {
        groupsTitle: string;
        moviesInGroup: Movie[];
    }[];

    export enum GroupSortingOrder {
        averageUserrating,
        averageRatingDiff,
        totalRatingDiff,
        numberOfWatches,
        averageRunningTime,
        totalRunningTime,
        averageReleaseYear,
        averageBudget,
        totalBudget,
    }

    export const groupSortingOrders = [
        { value: GroupSortingOrder.averageUserrating, name: 'Rating' },
        {
            value: GroupSortingOrder.averageRatingDiff,
            name: 'Average rating difference',
        },
        {
            value: GroupSortingOrder.totalRatingDiff,
            name: 'Total rating difference',
        },
        { value: GroupSortingOrder.numberOfWatches, name: 'Number of watches' },
        {
            value: GroupSortingOrder.averageRunningTime,
            name: 'Average running time',
        },
        {
            value: GroupSortingOrder.totalRunningTime,
            name: 'Total running time',
        },
        {
            value: GroupSortingOrder.averageReleaseYear,
            name: 'Average release year',
        },
        { value: GroupSortingOrder.averageBudget, name: 'Average budget' },
        { value: GroupSortingOrder.totalBudget, name: 'Total budget' },
    ];

    const sortForAverageUserRating = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                averageUserRating(groupB.moviesInGroup) -
                averageUserRating(groupA.moviesInGroup)
        );
    };

    const sortForAverageRatingDiff = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                averageRatingDiff(groupB.moviesInGroup) -
                averageRatingDiff(groupA.moviesInGroup)
        );
    };

    const sortForTotalRatingDiff = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                totalRatingDiff(groupB.moviesInGroup) -
                totalRatingDiff(groupA.moviesInGroup)
        );
    };

    const sortForNumberOfWatches = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                numberOfWatches(groupB.moviesInGroup) -
                numberOfWatches(groupA.moviesInGroup)
        );
    };

    const sortForAverageRunningTime = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort((groupA, groupB) => {
            const groupBAverageRunningTime = averageRunningTime(
                groupB.moviesInGroup
            );
            const groupAtotalRunningTime = averageRunningTime(
                groupA.moviesInGroup
            );

            return groupBAverageRunningTime - groupAtotalRunningTime;
        });
    };

    const sortForTotalRunningTime = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort((groupA, groupB) => {
            const groupBTotalRunningTime = totalRunningTime(
                groupB.moviesInGroup
            );
            const groupATotalRunningTime = totalRunningTime(
                groupA.moviesInGroup
            );

            return groupBTotalRunningTime - groupATotalRunningTime;
        });
    };

    const sortForAverageReleaseYear = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                averageReleaseYear(groupB.moviesInGroup) -
                averageReleaseYear(groupA.moviesInGroup)
        );
    };

    const sortForAverageBudget = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                averageBudget(groupB.moviesInGroup) -
                totalBudget(groupA.moviesInGroup)
        );
    };

    const sortForTotalBudget = (unsortedGroups: Groups): Groups => {
        return unsortedGroups.sort(
            (groupA, groupB) =>
                totalBudget(groupB.moviesInGroup) -
                totalBudget(groupA.moviesInGroup)
        );
    };

    const averageUserRating = (movies: Movie[]): number => {
        return averageNumber(
            movies.map((movie) => movie.diaryEntries.movie.rating)
        );
    };

    const totalRatingDiff = (movies: Movie[]): number => {
        return totalNumber(
            movies.map((movie) =>
                Math.abs(movie.voteAverage - movie.diaryEntries.movie.rating)
            )
        );
    };

    const averageRatingDiff = (movies: Movie[]): number => {
        return averageNumber(
            movies.map((movie) =>
                Math.abs(movie.voteAverage - movie.diaryEntries.movie.rating)
            )
        );
    };

    const numberOfWatches = (movies: Movie[]): number => {
        return totalNumber(
            movies.map((movie) => movie.diaryEntries.watchMoments.length)
        );
    };

    const averageRunningTime = (movies: Movie[]): number => {
        return averageNumber(
            movies.map((movie) => movie.runningTime.getTime())
        );
    };

    const totalRunningTime = (movies: Movie[]): number => {
        return totalNumber(movies.map((movie) => movie.runningTime.getTime()));
    };

    const averageReleaseYear = (movies: Movie[]): number => {
        return averageNumber(movies.map((movie) => movie.releaseYear));
    };

    const averageBudget = (movies: Movie[]): number => {
        return averageNumber(movies.map((movie) => movie.budgetInUsd));
    };

    const totalBudget = (movies: Movie[]): number => {
        return totalNumber(movies.map((movie) => movie.budgetInUsd));
    };

    const totalNumber = (numbers: number[]): number => {
        return numbers.reduce((total, number) => number + total, 0);
    };

    const averageNumber = (numbers: number[]): number => {
        let size = -1;
        return numbers.reduce((average, number) => {
            size++;
            return (size * average + number) / (size + 1);
        }, 0);
    };
</script>

<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import type { Movie } from '../types';

    export let title: string = '';
    export let groups: Groups = [];

    // move this to each page and just let this element render the list given?
    export let sortingOrder: GroupSortingOrder =
        GroupSortingOrder.averageUserrating;

    let movieSortingFunction: (m: Movie[]) => number = averageUserRating;

    const sort = () => {
        let groupSortingFunction: (m: Groups) => Groups =
            sortForAverageUserRating;

        switch (sortingOrder) {
            case GroupSortingOrder.averageUserrating:
                groupSortingFunction = sortForAverageUserRating;
                movieSortingFunction = averageUserRating;
            case GroupSortingOrder.averageRatingDiff:
                groupSortingFunction = sortForAverageRatingDiff;
                movieSortingFunction = averageRatingDiff;
            case GroupSortingOrder.totalRatingDiff:
                groupSortingFunction = sortForTotalRatingDiff;
                movieSortingFunction = totalRatingDiff;
            case GroupSortingOrder.numberOfWatches:
                groupSortingFunction = sortForNumberOfWatches;
                movieSortingFunction = numberOfWatches;
            case GroupSortingOrder.averageRunningTime:
                groupSortingFunction = sortForAverageRunningTime;
                movieSortingFunction = averageRunningTime;
            case GroupSortingOrder.totalRunningTime:
                groupSortingFunction = sortForTotalRunningTime;
                movieSortingFunction = totalRunningTime;
            case GroupSortingOrder.averageReleaseYear:
                groupSortingFunction = sortForAverageReleaseYear;
                movieSortingFunction = averageReleaseYear;
            case GroupSortingOrder.averageBudget:
                groupSortingFunction = sortForAverageBudget;
                movieSortingFunction = averageBudget;
            case GroupSortingOrder.totalBudget:
                groupSortingFunction = sortForTotalBudget;
                movieSortingFunction = totalBudget;
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
        <TableHeadCell>{title}</TableHeadCell>
        <TableHeadCell>Number of movies</TableHeadCell>
        <TableHeadCell>Sorting value</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each groups as group, index}
            <TableBodyRow>
                <TableBodyCell>{index + 1}</TableBodyCell>
                <TableBodyCell>{group.moviesInGroup.length}</TableBodyCell>
                <TableBodyCell>
                    {#if sortingOrder != GroupSortingOrder.averageRunningTime}
                        {movieSortingFunction(group.moviesInGroup)}
                    {:else}
                        {new Date(movieSortingFunction(group.moviesInGroup))}
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
