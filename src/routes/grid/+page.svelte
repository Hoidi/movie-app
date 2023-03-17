<script lang="ts">
    import MovieLayout from '../../movies/MovieLayout.svelte';
    import { movieStore } from '../../store/movies';
    import type { PageServerData } from './$types';

    export let data: PageServerData;
    movieStore.setFromPromiseList(data.myMoviesFetch);
</script>

<h1>Grid of movies</h1>

<MovieLayout layout="grid"/>
