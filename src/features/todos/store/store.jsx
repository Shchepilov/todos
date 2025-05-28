export const useTodosStore = (set) => ({
    todos: [],
    allTodos: [],
    setTodos: (todos) => set({ todos }),
    setAllTodos: (allTodos) => set({ allTodos })
});
