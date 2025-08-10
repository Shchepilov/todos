export const useTaskStore = (set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    droppedColumnId: null,
    setDroppedColumnId: (columnId) => set({ droppedColumnId: columnId }),
    taskFilters: {},
    setTaskFilters: (boardId, filters) => set((state) => ({
        taskFilters: {
            ...state.taskFilters,
            [boardId]: filters
        }
    })),
    getBoardFilters: (boardId) => (state) => state.taskFilters[boardId] || {
        assignee: [],
        type: [],
        priority: []
    }
});
