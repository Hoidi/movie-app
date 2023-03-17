import { diaryStore } from '../../store/diary';
import { movieStore } from '../../store/movies';
import { personStore } from '../../store/people';
import type { PageLoad } from './$types';

export const load = (({}) => {
    movieStore.reset();
    diaryStore.reset();
    personStore.reset();

    return {};
}) satisfies PageLoad;
