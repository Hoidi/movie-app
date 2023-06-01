<script lang="ts">
    import GroupedMovieList from '../../../components/GroupedMovieList.svelte';
    import { createGenreGroups } from '../../../sorting';
    import { groupedFilteringStore, movieStore } from '../../../store';

    $: groups = createGenreGroups(
        Object.values($movieStore),
        $groupedFilteringStore.filterOutGroupsOfOne
    );
</script>

{#key $groupedFilteringStore.sortingOrder}
    <GroupedMovieList title="Genre" {groups} />
{/key}
