<script lang="ts">
    import type { Movie } from '../types/movie';
    import MovieGridItem from './MovieGridItem.svelte';
    import { onDestroy } from 'svelte';
    import { movieStore } from '../store/movies';

    export let layout: 'grid' | 'list';

    let movies: Movie[] = [];

    const unsub = movieStore.subscribe((storedMovies) => {
        movies = Object.values(storedMovies);
    });

    onDestroy(unsub);
</script>

<div class={layout}>
    {#if layout === 'grid'}
        {#each movies as movie}
            <div class="movie">
                <MovieGridItem
                    title={movie.title}
                    posterPath={movie.posterPath}
                    voteAverage={movie.voteAverage}
                />
            </div>
        {/each}
    {:else}
        <div class="list">
            {#each movies as movie}
                <div class="listItem">
                    {movie.title} - {movie.releaseYear}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .grid {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: space-between;
        margin-left: 15%;
        margin-right: 15%;
    }

    .list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 0.5em;
        margin-left: 15%;
        margin-right: 15%;
    }

    .listItem {
        width: 100%;
    }

    .listItem:not(:last-child) {
        border-color: darkgray;
        border-width: 0px 0px 1px;
        border-style: solid;
    }

    .movie {
        margin: 20px;
    }
</style>
