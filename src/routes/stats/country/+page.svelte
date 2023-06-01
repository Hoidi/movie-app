<script lang="ts">
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { createCountryGroups } from '../../../sorting';
    import { groupedFilteringStore, movieStore } from '../../../store';

    $: groups = createCountryGroups(
        Object.values($movieStore),
        $groupedFilteringStore.filterOutGroupsOfOne
    );
</script>

{#key $groupedFilteringStore.sortingOrder}
    <GroupedMovieList title="Country" {groups} />
{/key}
