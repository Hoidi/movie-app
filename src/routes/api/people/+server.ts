import { error, json } from '@sveltejs/kit';
import { getCredits, getPerson } from '../../../api/tmdb.server';
import {
    newJob,
    newPerson,
    type Job,
    type MovieIdsQueryBody,
    type Person,
} from '../../../types';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    const movieIds: MovieIdsQueryBody = await request.json();

    movieIds.movieIds = movieIds.movieIds.slice(0, 30);

    movieIds.movieIds.forEach(verifyInput);

    const castAndCrewInMovies = await Promise.all(
        movieIds.movieIds.map(async (movieId) => {
            return await setupCastAndCrew(movieId);
        })
    );

    let people: Record<number, Job[]> = {};

    // add all cast and crew to same record
    castAndCrewInMovies.forEach((castAndCrew) => {
        Object.entries(castAndCrew).forEach(
            (personInMovie) =>
                (people = addPersonToRecord(
                    people,
                    Number(personInMovie[0]),
                    personInMovie[1]
                ))
        );
    });

    const peopleResults = await Promise.all(
        Object.entries(people).map(async (person) => {
            return recordItemToPerson(Number(person[0]), person[1]);
        })
    );

    return json({ peopleResults });
}) satisfies RequestHandler;

const verifyInput = (movieId: number) => {
    if (movieId == undefined) {
        throw error(418, 'Bad input');
    }

    if (movieId.toString().length > 20) {
        throw error(400, 'Too long id');
    }
};

const addPersonToRecord = (
    people: Record<number, Job[]>,
    personId: number,
    newJobs: Job[]
) => {
    newJobs.forEach((job) => {
        if (people[personId] == undefined) {
            people[personId] = [];
        }
        people[personId].push(job);
    });

    return people;
};

const setupCastAndCrew = async (
    movieId: number
): Promise<Record<number, Job[]>> => {
    const addToPeople = (id: number, job: string) => {
        if (people[id] == undefined) {
            people[id] = [];
        }
        people[id].push(newJob(movieId, job));
    };

    const people: Record<number, Job[]> = {};
    const peopleLimit = 10;
    const credits = await getCredits(movieId);

    if (credits) {
        // TODO: filter undefined
        // TODO: one person can have multiple jobs in one movie
        const cast = credits.cast.map((cast) => cast.id).slice(0, peopleLimit);
        const crew = credits.crew
            .map((crew) => ({
                id: crew.id,
                job: crew.job,
            }))
            .slice(0, peopleLimit);

        cast.forEach((castId) => {
            addToPeople(castId, 'Actor');
        });

        crew.forEach((crew) => {
            addToPeople(crew.id, crew.job);
        });

        const director = credits.crew.find((crew) => crew.job === 'Director');

        if (director) {
            addToPeople(director.id, director.job);
        }
    }

    return people;
};

const recordItemToPerson = async (
    id: number,
    jobs: Job[]
): Promise<Person | undefined> => {
    return getPerson(id).then((person) => {
        if (person) {
            return newPerson(
                person.id,
                person.name,
                getGender(person.gender),
                jobs,
                person.place_of_birth,
                person.birthday
            );
        }
    });
};

const getGender = (
    genderNumber: number
): 'female' | 'male' | 'other' | 'unknown' => {
    switch (genderNumber) {
        case 0:
            return 'unknown';
        case 1:
            return 'female';
        case 2:
            return 'male';
        case 3:
            return 'other';
        default:
            return 'unknown';
    }
};
