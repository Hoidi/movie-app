<script lang="ts">
    import { Alert, Select, Toggle } from 'flowbite-svelte';
    import { groupSortingOrders } from '../../sorting';
    import { groupedFilteringStore, movieStore } from '../../store';
</script>

<div class="content">
    <div class="filtering">
        <div class="toggle">
            <Toggle bind:checked={$groupedFilteringStore.filterOutGroupsOfOne}
                >Ignore results of only one movie</Toggle
            >
        </div>
        <div class="select">
            <Select
                class="mt-2"
                items={groupSortingOrders}
                bind:value={$groupedFilteringStore.sortingOrder}
            />
        </div>
    </div>

    <div class="list">
        {#if Object.values($movieStore).length === 0}
            <div style="margin-top: 50px;">
                <Alert color="yellow">
                    <span class="font-medium">No diary available. </span> Upload
                    your diary <a href="/upload">here</a> and try again.
                </Alert>
            </div>
        {:else}
            <slot />
        {/if}
    </div>
</div>

<style>
    .content {
        width: min(100%, 1400px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
    }

    .filtering {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        order: 2;
        height: fit-content;
        width: fit-content;
        width: 30%;
    }

    .list {
        margin-right: 20px;
        width: 70%;
    }

    .toggle {
        height: fit-content;
        width: 260px;
        align-self: center;
    }

    .select {
        height: fit-content;
        align-self: center;
    }

    @media (max-width: 1000px) {
        .content {
            flex-direction: column;
        }

        .filtering {
            flex-direction: row;
            justify-content: space-evenly;
            order: 1;
            width: 100%;
            margin-bottom: 20px;
        }

        .list {
            order: 2;
            width: 100%;
        }
    }
</style>
