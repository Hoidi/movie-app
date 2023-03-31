<script lang="ts">
    import { fade } from 'svelte/transition';
    import Poster from './Poster.svelte';
    import Score from './Score.svelte';

    export let title: string;
    export let voteAverage: number;
    export let posterPath: string;

    let posterBlur = false;

    function setBlur(_: Event) {
        posterBlur = true;
    }
    function unsetBlur(_: Event) {
        posterBlur = false;
    }

    const height = 225;
    $: width = height * (2 / 3);
</script>

<div class="frame" on:mouseenter={setBlur} on:mouseleave={unsetBlur}>
    <div class="poster" class:posterBlur transition:fade>
        <Poster {posterPath} />
    </div>
    {#if posterBlur}
        <div class="posterContentsContainer">
            <div class="posterContents title">
                {title}
            </div>
            <div class="posterContents score">
                <Score score={voteAverage} />
            </div>
        </div>
    {/if}
</div>

<style>
    .frame {
        width: 150px;
        aspect-ratio: 3/2;
        box-shadow: 0px 0px 8px 3px;
        border-style: solid;
        border-radius: 5px;
        border-width: 2px;
        border-color: black;
    }

    .posterContents {
        position: relative;
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        width: fit-content;
        font-weight: bold;
        color: black;
        background-color: #aaaaaa33;
        box-shadow: 0 0 10px 10px #aaaaaa33;
    }

    .title {
        top: -70%;
    }

    .score {
        top: -45%;
    }

    .poster {
        z-index: 0;
        overflow: hidden;
    }

    .posterBlur {
        filter: blur(3px);
    }
</style>
