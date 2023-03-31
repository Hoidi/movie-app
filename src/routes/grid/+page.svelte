<script lang="ts">
    import { Alert } from 'flowbite-svelte';
    import MovieLayout from '../../movies/MovieLayout.svelte';
    import MovieList from '../../movies/MovieList.svelte';
    import { movieStore } from '../../store/movies';
    import type { PageData } from './$types';

    export let data: PageData;

    let movieStorage = $movieStore;

    if (data.response) {
        movieStore.upsertFromList(data.response);
    }
</script>

<h1>Grid of movies</h1>

{#if Object.keys(movieStorage).length == 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <a href="/upload">here</a> and try again.
        </Alert>
    </div>
    ho
{:else}
    <MovieLayout layout="grid" />
    hi
    <MovieList />
{/if}

hello
