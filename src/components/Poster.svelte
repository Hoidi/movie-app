<script lang="ts">
    export let posterPath: string;
</script>

<img
    class="poster"
    src={'https://image.tmdb.org/t/p/original' + posterPath}
    alt="Movie Poster"
/>

<style>
    .poster {
        width: 100%;
    }
</style>
