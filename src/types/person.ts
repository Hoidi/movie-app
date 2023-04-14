import type { Job } from './job';

export type Person = {
    id: number;
    name: string;
    gender: 'female' | 'male' | 'other' | 'unknown';
    jobs: Job[];
    placeOfBirth?: string;
    dateOfBirth?: string; // change to Date later
};

export function newPerson(
    id: number,
    name: string,
    gender: 'female' | 'male' | 'other' | 'unknown',
    jobs: Job[],
    placeOfBirth?: string,
    dateOfBirth?: string
): Person {
    return {
        id: id,
        name: name,
        gender: gender,
        jobs: jobs,
        placeOfBirth: placeOfBirth,
        dateOfBirth: dateOfBirth,
    };
}
