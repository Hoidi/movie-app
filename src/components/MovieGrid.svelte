<script lang="ts">
    import { onDestroy } from 'svelte';
    import { movieStore } from '../store/movies';
    import type { Movie } from '../types/movie';
    import MovieGridItem from './MovieGridItem.svelte';

    let movies: Movie[] = [];

    const unsub = movieStore.subscribe((storedMovies) => {
        movies = Object.values(storedMovies);
    });

    onDestroy(unsub);
</script>

<div class="grid">
    {#each movies as movie}
        <div class="movie">
            <MovieGridItem
                title={movie.title}
                posterPath={movie.posterPath}
                voteAverage={movie.voteAverage}
            />
        </div>
    {/each}
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

    .movie {
        margin: 20px;
    }
</style>
