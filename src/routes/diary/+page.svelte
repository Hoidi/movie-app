<script lang="ts">
    import { LineChart } from '@carbon/charts-svelte';
    import '@carbon/charts/styles.css';
    import '@carbon/styles/css/styles.css';
    import { get } from 'svelte/store';
    import {
        createDayGroups,
        createMonthGroups,
        createYearGroups,
    } from '../../sorting/diarySorting';
    import { movieStore } from '../../store';
    import type { Groups } from '../../types';

    type DataPoint = {
        group: string;
        key: string;
        value: number;
    };

    const movies = Object.values(get(movieStore));

    const groups = createMonthGroups(movies);

    const createDataPoints = (groups: Groups): DataPoint[] => {
        return groups
            .map((group) => {
                return {
                    group: 'Movies',
                    key: group.groupsTitle,
                    value: group.moviesInGroup.length,
                };
            })
            .sort((gA: DataPoint, gB: DataPoint) => {
                if (gA.key < gB.key) {
                    return -1;
                }
                if (gA.key > gB.key) {
                    return 1;
                }
                return 0;
            });
    };
</script>

<LineChart
    data={createDataPoints(createDayGroups(Object.values($movieStore)))}
    options={{
        title: 'Number of movies per day',
        axes: {
            bottom: {
                title: 'Days',
                mapsTo: 'key',
                scaleType: 'labels',
            },
            left: {
                mapsTo: 'value',
                title: 'Number of movies',
                scaleType: 'linear',
            },
        },
        height: '400px',
    }}
/>

<LineChart
    data={createDataPoints(createMonthGroups(Object.values($movieStore)))}
    options={{
        title: 'Number of movies per month',
        axes: {
            bottom: {
                title: 'Months',
                mapsTo: 'key',
                scaleType: 'labels',
            },
            left: {
                mapsTo: 'value',
                title: 'Number of movies',
                scaleType: 'linear',
            },
        },
        height: '400px',
    }}
/>

<LineChart
    data={createDataPoints(createYearGroups(Object.values($movieStore)))}
    options={{
        title: 'Number of movies per year',
        axes: {
            bottom: {
                title: 'Years',
                mapsTo: 'key',
                scaleType: 'labels',
            },
            left: {
                mapsTo: 'value',
                title: 'Number of movies',
                scaleType: 'linear',
            },
        },
        height: '400px',
    }}
/>
