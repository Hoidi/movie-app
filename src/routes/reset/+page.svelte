<script lang="ts">
    import { diaryStore } from "../../store/diary";
    import { movieStore } from "../../store/movies";
    import { personStore } from "../../store/people";

    movieStore.reset();
    diaryStore.reset();
    personStore.reset();
</script>

<h1>Resetting stores</h1>
