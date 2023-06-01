<script lang="ts">
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { createActorGroups } from '../../../sorting';
    import { groupedFilteringStore, movieStore } from '../../../store';

    $: groups = createActorGroups(
        Object.values($movieStore),
        $groupedFilteringStore.filterOutGroupsOfOne
    );
</script>

{#key $groupedFilteringStore.sortingOrder}
    <GroupedMovieList title="Actor" {groups} />
{/key}
