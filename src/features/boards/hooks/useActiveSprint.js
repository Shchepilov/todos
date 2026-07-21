import { useStore } from '@store/store';

// The selected sprint is a per-user view filter kept in local storage,
// so choosing a sprint never changes what other board members see.
const useActiveSprint = (board) => {
    const sprintId = useStore((state) => state.activeSprints?.[board?.id] ?? null);

    if (!sprintId || !board?.sprints?.some(sprint => sprint.id === sprintId)) return null;

    return sprintId;
};

export default useActiveSprint;
