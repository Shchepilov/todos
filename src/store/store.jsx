import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

export const useStore = create(persist((set) => ({
    isLoading: false,
    currentUser: null,
    currentDay: new Date(),
    todos: [],
    error: null,
    fetchTodos: async () => {
        set({ isLoading: true, error: null });

        try {
          const querySnapshot = await getDocs(collection(db, "todos"));
          const newTodos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ todos: newTodos, isLoading: false });
        } catch (error) {
          console.error("Error fetching todos: ", error);
          set({ error: error.message, isLoading: false });
        }
    },
    addTodo: (todo) => set(state => ({ todos: [...state.todos, todo] })),
    removeTodo: (todo) => set(state => ({ todos: state.todos.filter(item => item !== todo) })),
    toggleTodo: (todo) => set(state => ({ todos: state.todos.map(item => item === todo ? { ...item, done: !item.done } : item) }))
})));
