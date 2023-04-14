import type { Job } from './job';
export type Person = {
    id: number;
    name: string;
    gender: 'female' | 'male' | 'other';
    jobs: Job[];
    placeOfBirth?: string;
    dateOfBirth?: Date;
};

export function newPerson(
    id: number,
    name: string,
    gender: 'female' | 'male' | 'other',
    jobs: Job[],
    placeOfBirth?: string,
    dateOfBirth?: Date
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
