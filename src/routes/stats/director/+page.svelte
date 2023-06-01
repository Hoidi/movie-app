<script lang="ts">
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { createDirectorGroups } from '../../../sorting';
    import { groupedFilteringStore, movieStore } from '../../../store';

    $: groups = createDirectorGroups(
        Object.values($movieStore),
        $groupedFilteringStore.filterOutGroupsOfOne
    );
</script>

{#key $groupedFilteringStore.sortingOrder}
    <GroupedMovieList title="Director" {groups} />
{/key}
