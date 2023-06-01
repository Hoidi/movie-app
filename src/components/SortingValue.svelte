<script lang="ts">
    import { P, Rating } from 'flowbite-svelte';

    export let value: string;
    export let component: svelteHTML.HTMLAttributes = P;
</script>

{#if component === P}
    <P>{value}</P>
{:else if component === Rating}
    <Rating
        total={Math.round(Math.max(Number(value), 5))}
        rating={Number(value)}
    />
{:else}
    <P>Error</P>
{/if}
