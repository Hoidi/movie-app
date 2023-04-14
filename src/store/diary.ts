import { persisted } from 'svelte-local-storage-store';
import type { DiaryEntry } from '../types';

function createDiary() {
    const { subscribe, set, update } = persisted(
        'diary',
        {},
        {
            storage: 'session',
        }
    );

    return {
        subscribe,
        set: (value: Map<string, DiaryEntry>) => {
            set(convertMapToRecord(value));
        },
        reset: () => {
            set({});
        },
    };
}

function convertMapToRecord(
    metricArguments: Map<string, DiaryEntry>
): Record<string, DiaryEntry> {
    let newObject: Record<string, DiaryEntry> = {};
    for (let [key, value] of metricArguments) {
        newObject[key] = value;
    }
    return newObject;
}

export const diaryStore = createDiary();
