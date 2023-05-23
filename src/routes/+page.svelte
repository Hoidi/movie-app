<script lang="ts">
    import { A, Heading, Hr, P } from 'flowbite-svelte';
</script>

<div class="content">
    <div class="header">
        <Heading tag="h1" class="mb-4">Welcome</Heading>
    </div>
    <div class="body">
        <P size="2xl"
            >I've made this website in order to see some neat statistics from my
            Letterboxd history. You can use it by downloading your Letterboxd
            history <A
                href="https://letterboxd.com/settings/data/"
                class="hover:underline">here</A
            > and upload it here <A href="/upload" class="hover:underline"
                >here</A
            >. After that you can check some statistics under the different
            stats pages.
        </P>
        <Hr class="my-4 mx-auto md:my-10" width="w-48" height="h-1" />
        <P size="lg">
            All data uploaded is only stored in your browsers session storage
            and titles along with release year is sent to tmdb in order to fetch
            information about the movies.
        </P>
    </div>
</div>

<style>
    .content {
        width: min(800px, 100%);
        height: fit-content;
        margin-top: min(25%, 150px);
        margin-left: auto;
        margin-right: auto;
    }

    .header {
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
    }

    .body {
        margin-top: 5%;
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    }
</style>
