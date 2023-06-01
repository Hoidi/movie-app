import { P, Rating } from 'flowbite-svelte';
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

const displayRunningTime = (runningTime: number): string => {
    return new Date(runningTime).toTimeString().split(' ')[0].slice(0, 5);
};

const displayNumberRounded = (num: number): string => {
    return num.toFixed(1);
};

const displayBudget = (budget: number): string => {
    const budgetString = String(budget.toFixed(0));

    // formats the budget like '12 345 678'
    const segments = budgetString
        .split('')
        .reduceRight((acc: string[], char: string, index: number) => {
            const isStartOfSegment = index !== budgetString.length - 1;
            const isDivisibleByThree =
                (budgetString.length - index - 1) % 3 === 0;

            if (isStartOfSegment && isDivisibleByThree) {
                acc.unshift(char); // Start a new segment
            } else {
                acc[0] = char + (acc[0] ?? ''); // Append to the current segment
            }
            return acc;
        }, []);

    return '$' + segments.join(' ') + '.00';
};

export type GroupSortingItem = {
    value: GroupSortingOrder;
    name: string;
    displayFunction: (value: any) => string;
    component: svelteHTML.HTMLAttributes;
};

export const groupSortingOrders: GroupSortingItem[] = [
    {
        value: GroupSortingOrder.averageUserRating,
        name: 'Average rating',
        displayFunction: displayNumberRounded,
        component: Rating,
    },
    {
        value: GroupSortingOrder.averageRatingDiff,
        name: 'Average rating difference',
        displayFunction: displayNumberRounded,
        component: Rating,
    },
    {
        value: GroupSortingOrder.totalRatingDiff,
        name: 'Total rating difference',
        displayFunction: displayNumberRounded,
        component: Rating,
    },
    {
        value: GroupSortingOrder.numberOfWatches,
        name: 'Number of watches',
        displayFunction: (watched: number) => String(watched),
        component: P,
    },
    {
        value: GroupSortingOrder.averageRunningTime,
        name: 'Average running time',
        displayFunction: displayRunningTime,
        component: P,
    },
    {
        value: GroupSortingOrder.totalRunningTime,
        name: 'Total running time',
        displayFunction: displayRunningTime,
        component: P,
    },
    {
        value: GroupSortingOrder.averageReleaseYear,
        name: 'Average release year',
        displayFunction: displayNumberRounded,
        component: P,
    },
    {
        value: GroupSortingOrder.averageBudget,
        name: 'Average budget',
        displayFunction: displayBudget,
        component: P,
    },
    {
        value: GroupSortingOrder.totalBudget,
        name: 'Total budget',
        displayFunction: displayBudget,
        component: P,
    },
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
