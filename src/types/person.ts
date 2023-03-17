export type Person = {
    id: number;
    name: string;
    gender: 'female' | 'male' | 'other';
    roles: Map<number, string>;
    placeOfBirth?: string;
    dateOfBirth?: Date;
};

export function newPerson(
    id: number,
    name: string,
    gender: 'female' | 'male' | 'other',
    placeOfBirth?: string,
    dateOfBirth?: Date
): Person {
    return {
        id: id,
        name: name,
        gender: gender,
        roles: new Map(),
        placeOfBirth: placeOfBirth,
        dateOfBirth: dateOfBirth,
    };
}
