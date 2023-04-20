import type { MovieIdsQueryBody, Person } from '../types';

export const fetchPeople = async (
    moveiIdsQueryBody: MovieIdsQueryBody
): Promise<Person[]> => {
    if (moveiIdsQueryBody.movieIds.length === 0) {
        console.log('no need to fetch people');
        return Promise.resolve([]);
    }

    moveiIdsQueryBody.movieIds = moveiIdsQueryBody.movieIds.slice(0, 30);

    return fetch('/api/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(moveiIdsQueryBody),
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json.peopleResults.filter(Boolean);
        });
};
