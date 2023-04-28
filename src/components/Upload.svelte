<script lang="ts">
    import { filedrop, type Files } from 'filedrop-svelte';
    import { Button } from 'flowbite-svelte';
    import { parse } from 'papaparse';
    import { unzip } from 'unzipit';
    import { fetchPeople, searchMovies } from '../api';
    import { diaryStore, movieStore, personStore } from '../store';
    import type {
        DiaryEntry,
        DiaryMovie,
        SearchMovie,
        SearchMovieQueryBody,
        WatchMoment,
    } from '../types';

    let files: Files;
    let options = {};

    const movies: Set<SearchMovie> = new Set();

    movieStore.subscribe((storedMovies) => {
        let movieList = Object.values(storedMovies);

        movies.clear();

        movieList.forEach((movie) => movies.add({ ...movie }));
    });

    const readFileIntoStores = async (index: number) => {
        let f = files.accepted[index];

        if (f.type === 'application/x-zip-compressed') {
            const diary = await readZipIntoDiary(await f.arrayBuffer());

            if (diary) {
                const searchItems =
                    filterMoviesBasedOnAlreadyFetchedMovies(diary);

                const movieSearchResults = await searchMovies(searchItems);

                if (!movieSearchResults) {
                    return;
                }

                movieStore.upsertList(movieSearchResults);

                diaryStore.set(diary);

                const peopleResults = await fetchPeople({
                    movieIds: movieSearchResults
                        .map((movie) => movie?.id)
                        .filter(Boolean),
                });

                personStore.setFromList(peopleResults);

                peopleResults.forEach((person) => {
                    person.jobs.forEach((job) => {
                        if (job.job === 'Actor') {
                            $movieStore[job.movieId].cast.push({ person, job });
                        } else {
                            $movieStore[job.movieId].crew.push({ person, job });
                        }
                    });
                });
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
</script>

<div
    use:filedrop={options}
    on:filedrop={(e) => {
        files = e.detail.files;
    }}
    class="filedrop"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="48"
        height="48"
    >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
            d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 13v4h-2v-4H8l4-5 4 5h-3z"
        />
    </svg>
    <p>Drag &amp; drop files</p>
</div>

{#if files}
    <h3>Accepted files</h3>
    <ul>
        {#each files.accepted as file, i}
            <li>
                {file.name} -
                <Button on:click={(_) => readFileIntoStores(i)}
                    >Read file</Button
                >
            </li>
        {/each}
    </ul>
    <h3>Rejected files</h3>
    <ul>
        {#each files.rejected as rejected}
            <li>{rejected.file.name} - {rejected.error.message}</li>
        {/each}
    </ul>
{/if}

<style>
    .filedrop {
        background-color: #f0f0f0;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        border: 0.7em dashed #c3c3c3;
        outline: 1em solid #f0f0f0;
        transition: border 0.3s ease-in-out;
        outline-offset: -1.3em;
        padding: 0.475em;
    }
    .filedrop:focus {
        border-color: #2196f3;
    }
    .filedrop:hover {
        border-color: #343434;
    }
    .filedrop p,
    .filedrop svg {
        transition: color 0.1s;
        transition: fill 0.1s;
    }
    .filedrop:focus p,
    .filedrop:focus svg {
        color: #2196f3;
        fill: #2196f3;
    }
    .filedrop:hover p,
    .filedrop:hover svg {
        color: #343434;
        fill: #343434;
    }
    p {
        color: #373737;
        font-size: 1.2em;
        cursor: default;
        align-content: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
</style>
