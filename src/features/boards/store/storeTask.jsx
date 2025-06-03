export const useTaskStore = (set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    droppedColumnId: null,
    setDroppedColumnId: (columnId) => set({ droppedColumnId: columnId })
});
