<script lang="ts">
    import { Alert } from 'flowbite-svelte';
    import MovieList from '../../components/MovieList.svelte';
    import { movieStore } from '../../store/movies';
</script>

{#if Object.values($movieStore).length === 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <a href="/upload">here</a> and try again.
        </Alert>
    </div>
{:else}
    <MovieList
        movies={Object.values($movieStore).sort((movieA, movieB) => {
            if (movieA.title < movieB.title) {
                return -1;
            }
            if (movieA.title > movieB.title) {
                return 1;
            }
            return 0;
        })}
    />
{/if}
