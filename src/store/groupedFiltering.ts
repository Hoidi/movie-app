import { persisted } from 'svelte-local-storage-store';
import { GroupSortingOrder } from '../sorting';

type GroupedFilteringOptions = {
    filterOutGroupsOfOne: boolean;
    sortingOrder: GroupSortingOrder;
};

let initial: GroupedFilteringOptions = {
    filterOutGroupsOfOne: true,
    sortingOrder: GroupSortingOrder.averageUserRating,
};

function createGroupedFiltering() {
    const { subscribe, set } = persisted('filter', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        set,
        reset: () => set(initial),
    };
}

export const groupedFilteringStore = createGroupedFiltering();
