export type Job = {
    movieId: number;
    job: string;
};

export function newJob(movieId: number, job: string): Job {
    return {
        movieId: movieId,
        job: job,
    };
}
