import type { Groups } from '../types';
import {
    averageBudget,
    averageRatingDiff,
    averageReleaseYear,
    averageRunningTime,
    averageUserRating,
    numberOfWatches,
    totalBudget,
    totalRatingDiff,
    totalRunningTime,
} from './movies';

export enum GroupSortingOrder {
    averageUserRating,
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
    { value: GroupSortingOrder.averageUserRating, name: 'Average rating' },
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

export const sortForAverageUserRating = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            averageUserRating(groupB.moviesInGroup) -
            averageUserRating(groupA.moviesInGroup)
    );
};

export const sortForAverageRatingDiff = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            averageRatingDiff(groupB.moviesInGroup) -
            averageRatingDiff(groupA.moviesInGroup)
    );
};

export const sortForTotalRatingDiff = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            totalRatingDiff(groupB.moviesInGroup) -
            totalRatingDiff(groupA.moviesInGroup)
    );
};

export const sortForNumberOfWatches = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            numberOfWatches(groupB.moviesInGroup) -
            numberOfWatches(groupA.moviesInGroup)
    );
};

export const sortForAverageRunningTime = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            averageRunningTime(groupB.moviesInGroup) -
            averageRunningTime(groupA.moviesInGroup)
    );
};

export const sortForTotalRunningTime = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            totalRunningTime(groupB.moviesInGroup) -
            totalRunningTime(groupA.moviesInGroup)
    );
};

export const sortForAverageReleaseYear = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            averageReleaseYear(groupB.moviesInGroup) -
            averageReleaseYear(groupA.moviesInGroup)
    );
};

export const sortForAverageBudget = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            averageBudget(groupB.moviesInGroup) -
            averageBudget(groupA.moviesInGroup)
    );
};

export const sortForTotalBudget = (unsortedGroups: Groups): Groups => {
    return unsortedGroups.sort(
        (groupA, groupB) =>
            totalBudget(groupB.moviesInGroup) -
            totalBudget(groupA.moviesInGroup)
    );
};
