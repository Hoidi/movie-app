<script lang="ts">
    import { Progressbar } from 'flowbite-svelte';
    import { fade } from 'svelte/transition';
    import Upload from '../../components/Upload.svelte';

    const handleUpdateLoadbar = (
        event: CustomEvent<{ statusPercentrage: number; statusText: string }>
    ) => {
        statusPercentrage = event.detail.statusPercentrage;
        statusText = event.detail.statusText;

        if (statusPercentrage === 100) {
            new Promise((resolve) => setTimeout(resolve, 1000)).then((_) => {
                statusPercentrage = 0;
                statusText = '';
            });
        }
    };

    let statusPercentrage: number = 0;
    let statusText = '';
</script>

<h1>Here you can upload stuff</h1>

<Upload on:loadbarStatus={handleUpdateLoadbar} />

{#if statusPercentrage > 0}
    <div out:fade>
        <Progressbar
            progress={String(statusPercentrage)}
            labelOutside={statusText}
        />
    </div>
{/if}
