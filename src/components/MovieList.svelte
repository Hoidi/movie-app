<script lang="ts">
    import {
        Rating,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import { onDestroy } from 'svelte';
    import { movieStore } from '../store';
    import type { Movie } from '../types';

    let movies: Movie[] = [];

    const unsub = movieStore.subscribe((storedMovies) => {
        movies = Object.values(storedMovies);
    });

    onDestroy(unsub);
</script>

<Table hoverable>
    <TableHead>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Average rating</TableHeadCell>
        <TableHeadCell>Your rating</TableHeadCell>
        <TableHeadCell>Genre</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each movies as movie}
            <TableBodyRow>
                <TableBodyCell>{movie.title}</TableBodyCell>
                <TableBodyCell>
                    <Rating
                        total={5}
                        rating={Math.round(movie.voteAverage / 2)}
                    >
                        <p
                            slot="text"
                            class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {(movie.voteAverage / 2).toFixed(1)} out of 5
                        </p>
                    </Rating>
                </TableBodyCell>
                <TableBodyCell
                    ><Rating total={5} rating={movie.diaryEntries.movie.rating}>
                        <p
                            slot="text"
                            class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {movie.diaryEntries.movie.rating.toFixed(1)} out of 5
                        </p>
                    </Rating></TableBodyCell
                >
                <TableBodyCell>{movie.genres.join(', ')}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
