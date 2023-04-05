<script lang="ts">
    import { Alert } from 'flowbite-svelte';
    import MovieGrid from '../../components/MovieGrid.svelte';
    import MovieList from '../../components/MovieList.svelte';
    import { movieStore } from '../../store/movies';

    let movieStorage = $movieStore;
</script>

{#if Object.keys(movieStorage).length == 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <a href="/upload">here</a> and try again.
        </Alert>
    </div>
{:else}
    <MovieList />

    <MovieGrid />
{/if}
