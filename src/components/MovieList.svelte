<script lang="ts">
    import {
        P,
        Rating,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import type { Movie } from '../types';

    export let movies: Movie[] = [];
</script>

<Table hoverable>
    <TableHead>
        <TableHeadCell>Order</TableHeadCell>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Average rating</TableHeadCell>
        <TableHeadCell>Your rating</TableHeadCell>
        <TableHeadCell>Genre</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each movies as movie, index}
            <TableBodyRow>
                <TableBodyCell>{index + 1}</TableBodyCell>
                <TableBodyCell>{movie.title}</TableBodyCell>
                <TableBodyCell>
                    <Rating total={5} rating={movie.voteAverage / 2}>
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
                        <P
                            slot="text"
                            class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {movie.diaryEntries.movie.rating.toFixed(1)} out of 5
                        </P>
                    </Rating></TableBodyCell
                >
                <TableBodyCell>{movie.genres.join(', ')}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
