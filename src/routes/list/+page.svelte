<script lang="ts">
    import { A, Alert } from 'flowbite-svelte';
    import MovieList from '../../components/MovieList.svelte';
    import { alphabetically } from '../../sorting';
    import { movieStore } from '../../store/movies';
</script>

{#if Object.values($movieStore).length === 0}
    <div style="margin-top: 50px;">
        <Alert color="yellow">
            <span class="font-medium">No diary available. </span> Upload your
            diary <A href="/upload">here</A> and try again.
        </Alert>
    </div>
{:else}
    <MovieList movies={Object.values($movieStore).sort(alphabetically)} />
{/if}
