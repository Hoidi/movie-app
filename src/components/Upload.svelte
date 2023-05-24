<script lang="ts">
    import { Button, Fileupload, Label } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { fetchPeople, searchMovies } from '../api';
    import { readCsv } from '../parsing';
    import {
        diaryStore,
        movieStore,
        personStore,
        type MovieIdMap,
    } from '../store';
    import type {
        DiaryEntry,
        SearchMovie,
        SearchMovieQueryBody,
    } from '../types';

    let files: FileList;

    const movies: Set<SearchMovie> = new Set();

    movieStore.subscribe((storedMovies) => {
        let movieList = Object.values(storedMovies);

        movies.clear();

        movieList.forEach((movie) => movies.add({ ...movie }));
    });

    const readFileIntoStores = async (files: FileList) => {
        const file = files.item(0);

        if (!file) {
            return;
        }

        updateLoadbar(1, 'Fetching movies');

        if (file.type === 'application/vnd.ms-excel') {
            const diary = await readCsv(await file.text());

            if (diary) {
                const searchItems =
                    filterMoviesBasedOnAlreadyFetchedMovies(diary);

                const movieSearchResults = await searchMovies(searchItems);
                updateLoadbar(50, 'Fetching people');

                diaryStore.set(diary);

                const peopleResults = await fetchPeople({
                    movieIds: movieSearchResults
                        .map((movie) => movie?.id)
                        .filter(Boolean),
                });

                updateLoadbar(95, 'Finalizing');

                personStore.setFromList(peopleResults);

                const movieRecord: MovieIdMap = {};
                movieSearchResults.forEach((movie) => {
                    movieRecord[movie.id] = movie;
                });

                peopleResults.forEach((person) =>
                    person.jobs.forEach((job) => {
                        const movie = movieRecord[job.movieId];

                        if (job.job === 'Actor') {
                            movie.cast.push({ person, job });
                        } else {
                            movie.crew.push({ person, job });
                        }
                    })
                );

                updateLoadbar(100, 'Done');

                movieStore.set(movieRecord);
            }
        }
    };

    const filterMoviesBasedOnAlreadyFetchedMovies = (
        diary: Map<string, DiaryEntry>
    ): SearchMovieQueryBody => {
        const searchItems: SearchMovieQueryBody = [];

        diary.forEach((diaryMovie, key, map) => {
            const searchMovie: SearchMovie = {
                title: diaryMovie.movie.title,
                releaseYear: diaryMovie.movie.releaseYear,
                diaryEntries: diaryMovie,
            };

            if (!movies.has(searchMovie)) {
                searchItems.push(searchMovie);
            }
        });

        return searchItems;
    };

    const dispatch = createEventDispatcher();
    function updateLoadbar(statusPercentrage: number, statusText: string) {
        dispatch('loadbarStatus', {
            statusPercentrage: statusPercentrage,
            statusText: statusText,
        });
    }
</script>

<div class="content">
    <Label class="pb-2 pt-2">Upload your Letterboxd diary csv</Label>
    <div class="buttons">
        <div class="fileupload">
            <Fileupload bind:files />
        </div>
        <div class="read">
            <Button
                color="blue"
                on:click={(_) => {
                    readFileIntoStores(files);
                }}>Read files</Button
            >
        </div>
    </div>
</div>

<style>
    .content {
        top: 300px;
        margin-left: 20%;
        margin-right: 20%;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        height: fit-content;
    }

    .fileupload {
        width: 60%;
        height: 100%;
    }

    .read {
        width: fit-content;
    }
</style>
