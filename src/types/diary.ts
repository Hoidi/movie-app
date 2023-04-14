export type DiaryEntry = {
    watchMoments: WatchMoment[];
    movie: DiaryMovie;
};

export type WatchMoment = {
    dateAdded: Date;
    rewatch: boolean;
    watchedDate: Date;
};

export type DiaryMovie = {
    title: string;
    releaseYear: number;
    letterboxdURI: string;
    rating: number;
    tags: string[];
};
