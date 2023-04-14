import { persisted } from 'svelte-local-storage-store';
import type { Person } from '../types';

export type PersonIdMap = Record<number, Person>;

let initial: PersonIdMap = {};

function createPeople() {
    const { subscribe, set, update } = persisted('people', initial, {
        storage: 'session',
    });

    return {
        subscribe,
        upsert: (person: Person) => {
            update((record) => ({ ...record, [person.id]: person }));
        },
        setFromList: (people: Person[]) => {
            set(
                people.reduce(
                    (record, person) => ({ ...record, [person.id]: person }),
                    {}
                )
            );
        },
        setFromPromiseList: async (
            personPromises: Promise<Person | undefined>[]
        ) => {
            const people = await Promise.all(personPromises);

            const record: PersonIdMap = {};

            people.forEach((person) => {
                if (person) {
                    record[person.id] = person;
                }
            });

            set(record);
        },
        reset: () => set(initial),
    };
}

export const personStore = createPeople();
