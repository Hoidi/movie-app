<script lang="ts">
    import { Alert, Button, Select } from 'flowbite-svelte';
    import { onDestroy } from 'svelte';
    import MovieList from '../../../components/MovieList.svelte';
    import { movieStore } from '../../../store';
    import type { Movie, Person } from '../../../types';

    enum SortingOrder {
        rating,
        ratingDiff,
        numRewatches,
        runningTime,
        releaseYear,
        director,
        budget,
        countryOfOrigin,
    }

    let sortingOrders = [
        { value: SortingOrder.rating, name: 'Rating' },
        { value: SortingOrder.ratingDiff, name: 'Rating difference' },
        { value: SortingOrder.numRewatches, name: 'Number of rewatches' },
        { value: SortingOrder.runningTime, name: 'Running time' },
        { value: SortingOrder.releaseYear, name: 'Release year' },
        { value: SortingOrder.director, name: 'Director' },
        { value: SortingOrder.budget, name: 'Budget' },
        { value: SortingOrder.countryOfOrigin, name: 'Country of origin' },
    ];

    let movies: Movie[] = [];
    let sortingOrder: SortingOrder = SortingOrder.rating;

    const unsub = movieStore.subscribe((storedMovies) => {
        const unsortedMovies = Object.values(storedMovies);

        movies = unsortedMovies;
    });

    const sort = () => {
        let sortingFunction: (m: Movie[]) => Movie[] = sortForUserRating;

        switch (sortingOrder) {
            case SortingOrder.rating:
                sortingFunction = sortForUserRating;
            case SortingOrder.ratingDiff:
                sortingFunction = sortForRatingDiff;
            case SortingOrder.numRewatches:
                sortingFunction = sortForRewatches;
            case SortingOrder.runningTime:
                sortingFunction = sortForRunningTime;
            case SortingOrder.releaseYear:
                sortingFunction = sortForReleaseYear;
            case SortingOrder.director:
                sortingFunction = sortForDirector;
            case SortingOrder.budget:
                sortingFunction = sortForBudget;
            case SortingOrder.countryOfOrigin:
                sortingFunction = sortForCountryOfOrigin;
            default:
                sortingFunction = sortForUserRating;
        }

        movies = sortingFunction(movies);
    };

    onDestroy(unsub);

    const sortForUserRating = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort(
            (movieA, movieB) =>
                movieB.diaryEntries.movie.rating -
                movieA.diaryEntries.movie.rating
        );
    };

    const sortForRatingDiff = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort((movieA, movieB) => 0);
    };

    const sortForRewatches = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort(
            (movieA, movieB) =>
                movieB.diaryEntries.watchMoments.length -
                movieA.diaryEntries.watchMoments.length
        );
    };

    const sortForRunningTime = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort(
            (movieA, movieB) =>
                movieB.runningTime.getTime() - movieA.runningTime.getTime()
        );
    };

    const sortForReleaseYear = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort(
            (movieA, movieB) => movieB.releaseYear - movieA.releaseYear
        );
    };

    const sortForDirector = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort((movieA, movieB) => {
            const directorA: Person | undefined = movieA.cast.find(
                (p) => p.job.job === 'Director'
            )?.person;
            const directorB: Person | undefined = movieB.cast.find(
                (p) => p.job.job === 'Director'
            )?.person;

            if (!directorA) {
                return 1;
            }
            if (!directorB) {
                return -1;
            }

            return directorB.name.localeCompare(directorA.name);
        });
    };

    const sortForBudget = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort(
            (movieA, movieB) => movieB.budgetInUsd - movieA.budgetInUsd
        );
    };

    const sortForCountryOfOrigin = (unsortedMovies: Movie[]): Movie[] => {
        return unsortedMovies.sort((movieA, movieB) => {
            if (movieA.countryOfOrigin === 'Unknown') {
                if (movieB.countryOfOrigin === 'Unknown') {
                    return 0;
                }
                return 1;
            }
            if (movieB.countryOfOrigin === 'Unknown') {
                return -1;
            }

            return movieB.countryOfOrigin.localeCompare(movieA.countryOfOrigin);
        });
    };
</script>

<div class="sortSelection">
    <Select class="mt-2" items={sortingOrders} bind:value={sortingOrder} />
    <Button on:click={sort}>Sort</Button>
</div>

{#if movies.length == 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <a href="/upload">here</a> and try again.
        </Alert>
    </div>
{:else}
    <!-- TODO: This will probably have to be replaced by custom element for each sorting type. And make sorting funtions better, like grouping directors -->
    <MovieList {movies} />
{/if}

<style>
    .sortSelection {
        display: flex;
    }
</style>
