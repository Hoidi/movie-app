<script lang="ts">
    import { Button, Toast } from 'flowbite-svelte';
    import {
        diaryStore,
        groupedFilteringStore,
        movieStore,
        personStore,
    } from '../../store';

    let showToast = false;

    async function hideToast() {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        showToast = false;
    }

    async function resetStores() {
        showToast = true;
        movieStore.reset();
        diaryStore.reset();
        personStore.reset();
        groupedFilteringStore.reset();
        hideToast();
    }
</script>

<Button color="blue" on:click={resetStores}>Reset stores</Button>

<div class="toast">
    <Toast color="green" class="mb-2" bind:open={showToast}>
        <svelte:fragment slot="icon">
            <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                /></svg
            >
            <span class="sr-only">Check icon</span>
        </svelte:fragment>
        Stores reset successfully.
    </Toast>
</div>

<style>
    .toast {
        position: fixed;
        bottom: 1em;
        right: 2em;
    }
</style>
