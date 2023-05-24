<script lang="ts">
    import { Button, Fileupload, Label } from 'flowbite-svelte';
    import { parse } from 'papaparse';
    import { createEventDispatcher } from 'svelte';
    import { unzip } from 'unzipit';
    import { fetchPeople, searchMovies } from '../api';
    import {
        diaryStore,
        movieStore,
        personStore,
        type MovieIdMap,
    } from '../store';
    import type {
        DiaryEntry,
        DiaryMovie,
        SearchMovie,
        SearchMovieQueryBody,
        WatchMoment,
    } from '../types';

    let files: FileList;

    const movies: Set<SearchMovie> = new Set();

    movieStore.subscribe((storedMovies) => {
        let movieList = Object.values(storedMovies);

        movies.clear();

        movieList.forEach((movie) => movies.add({ ...movie }));
    });

    const readFileIntoStores = async (files: FileList) => {
        if (files.length < 1) {
            return;
        }

        updateLoadbar(1, 'Fetching movies');

        const file = files.item(0);

        if (file?.type === 'application/x-zip-compressed') {
            const diary = await readZipIntoDiary(await file.arrayBuffer());

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

    const readZipIntoDiary = async (url: ArrayBuffer) => {
        if (url == undefined) {
            return;
        }

        const { entries } = await unzip(url);

        return await readCsv(await entries['diary.csv'].text());
    };

    const readCsv = async (
        content: string
    ): Promise<Map<string, DiaryEntry>> => {
        const getOrCreateDiaryEntry = (
            key: string,
            movie: DiaryMovie
        ): DiaryEntry => {
            const existingEntry = diary.get(key);
            if (existingEntry) {
                return existingEntry;
            }
            const newEntry = { movie: movie, watchMoments: [] };
            diary.set(key, newEntry);
            return newEntry;
        };

        // parse data with last newline removed to avoid error
        const { data, errors, _ } = await parse(content.slice(0, -1), {
            header: true,
        });

        let diary: Map<string, DiaryEntry> = new Map();

        if (errors.length > 0) {
            return new Map();
        }

        data.forEach((entry: any) => {
            const movie: DiaryMovie = {
                title: entry.Name,
                releaseYear: Number(entry.Year),
                tags: entry.Tags,
                letterboxdURI: entry['Letterboxd URI'],
                rating: Number(entry.Rating),
            };

            const watchMoment: WatchMoment = {
                dateAdded: parseDate(entry.Date),
                rewatch: entry.Rewatch === 'Yes',
                watchedDate: parseDate(entry['Watched Date']),
            };

            const key = keyFromDiaryMovie(movie);

            const diaryEntry = getOrCreateDiaryEntry(key, movie);
            diaryEntry.watchMoments.push(watchMoment);
        });

        return diary;
    };

    const keyFromDiaryMovie = (movie: DiaryMovie) => {
        return `${movie.title}-${movie.releaseYear}`;
    };

    const parseDate = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
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
