export const useBoardStore = (set) => ({
    boards: [],
    activeBoardId: null,
    setBoards: (boards) => set({ boards }),
    setActiveBoardId: (id) => set({ activeBoardId: id })
});
