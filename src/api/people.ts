import type { PeopleFromMovieBody } from '../routes/api/people/+server';
import type { Person } from '../types/person';

export const fetchPeople = async (
    searchItems: PeopleFromMovieBody[]
): Promise<Person[]> => {
    if (searchItems.length === 0) {
        console.log('no need to fetch people');
        return Promise.resolve([]);
    }

    const body = {
        movieIds: searchItems.slice(0, 30),
    };

    return fetch('/api/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json.peopleResults;
        });
};
