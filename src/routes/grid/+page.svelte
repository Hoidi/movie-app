<script lang="ts">
    import MovieLayout from '../../movies/MovieLayout.svelte';
    import { movieStore } from '../../store/movies';
    import type { PageData } from './$types';

    export let data: PageData;

    if (data.response) {
        movieStore.upsertFromList(data.response);
    }
</script>

<h1>Grid of movies</h1>

<MovieLayout layout="grid"/>
