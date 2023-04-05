<script lang="ts">
    import { filedrop, type Files } from 'filedrop-svelte';
    import { Button } from 'flowbite-svelte';
    import { parse } from 'papaparse';
    import { unzip } from 'unzipit';
    import type { SearchItem } from '../routes/api/movies/+server';
    import { diaryStore } from '../store/diary';
    import { movieStore } from '../store/movies';
    import type { DiaryEntry } from '../types/diary';
    import type { Movie } from '../types/movie';

    let files: Files;
    let options = {};

    let diary: DiaryEntry[] = [];

    diaryStore.subscribe((storedDiary) => {
        diary = storedDiary;
    });

    const movies: Set<SearchItem> = new Set();

    movieStore.subscribe((storedMovies) => {
        let movieList = Object.values(storedMovies);

        movies.clear();

        movieList.forEach((movie) =>
            movies.add({
                title: movie.title,
                releaseYear: movie.releaseYear,
            })
        );
    });

    async function readFile(index: number) {
        let f = files.accepted[index];

        if (f.type === 'application/x-zip-compressed') {
            const diary = await readZipIntoDiary(await f.arrayBuffer());

            if (diary != undefined) {
                const searchItems: SearchItem[] =
                    filterMovieBasedOnAlreadyFetchedMovies(diary);

                const searchResults = await searchMovies(searchItems);

                movieStore.upsertList(searchResults);
                diaryStore.set(diary);
            }
        }
    }

    async function readZipIntoDiary(url: ArrayBuffer) {
        if (url == undefined) {
            return;
        }

        const { entries } = await unzip(url);

        return await readCsv(await entries['diary.csv'].text());
    }

    async function readCsv(content: string): Promise<DiaryEntry[]> {
        // parse data with last newline removed to avoid error
        const { data, errors, _ } = await parse(content.slice(0, -1), {
            header: true,
        });

        let diary: DiaryEntry[] = [];

        if (errors.length > 0) {
            return diary;
        }

        for (let i = 0; i < data.length; i++) {
            const diaryEntry: DiaryEntry = {
                dateAdded: data[i].Date,
                title: data[i].Name,
                releaseYear: Number(data[i].Year),
                letterboxdURI: data[i]['Letterboxd URI'],
                rating: Number(data[i].Rating),
                rewatch: data[i].Rewatch === 'Yes',
                tags: data[i].Tags,
                watchedDate: toDate(data[i]['Watched Date']),
            };

            diary.push(diaryEntry);
        }

        return diary;
    }

    function toDate(date: string): Date {
        var parts = date.split('-');
        return new Date(
            Number(parts[2]),
            Number(parts[1]) - 1,
            Number(parts[0])
        );
    }

    const filterMovieBasedOnAlreadyFetchedMovies = (
        diary: DiaryEntry[]
    ): SearchItem[] => {
        const searchItems: SearchItem[] = [];

        diary.forEach((diaryEntry) => {
            const searchItem: SearchItem = {
                title: diaryEntry.title,
                releaseYear: diaryEntry.releaseYear,
            };

            if (!movies.has(searchItem)) {
                searchItems.push(searchItem);
            }
        });

        return searchItems.slice(0, 30);
    };

    const searchMovies = async (
        searchItems: SearchItem[]
    ): Promise<Movie[]> => {
        if (searchItems.length === 0) {
            console.log('no need to fetch movies');
            return Promise.resolve([]);
        }

        const body = {
            movies: searchItems.slice(0, 30),
        };

        return fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                return json.searchResults;
            });
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
                <Button on:click={(_) => readFile(i)}>Read file</Button>
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
