export const useBoardStore = (set) => ({
    boards: [],
    activeBoardId: null,
    // Sprint selection is per user, not part of the shared board document
    activeSprints: {},
    setBoards: (boards) => set({ boards }),
    setActiveBoardId: (id) => set({ activeBoardId: id }),
    setActiveSprint: (boardId, sprintId) => set((state) => ({
        activeSprints: {
            ...state.activeSprints,
            [boardId]: sprintId || null
        }
    }))
});
