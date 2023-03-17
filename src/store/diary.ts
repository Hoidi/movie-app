import type { DiaryEntry } from '../types/diary';
import { persisted } from 'svelte-local-storage-store';

const initial: DiaryEntry[] = [];

function createDiary() {
    const { subscribe, set, update } = persisted('diary', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        set,
        reset: () => {
            set([]);
        },
    };
}

export const diaryStore = createDiary();
