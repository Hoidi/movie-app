import { persisted } from 'svelte-local-storage-store';
import type { DiaryEntry } from '../types';

const initial: DiaryEntry[] = [];

function createDiary() {
    const { subscribe, set, update } = persisted('diary', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        set,
        reset: () => {
            set(initial);
        },
    };
}

export const diaryStore = createDiary();
