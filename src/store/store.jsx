import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import dayjs from "dayjs";

export const useStore = create(persist((set, get) => ({
    user: null,
    currentDay: dayjs(),
    todos: [],
    allTodos: [],
    errorMessage: null,

    setCurrentDay: (currentDay) => set({ currentDay }),

    signIn: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            set({ user: result.user, errorMessage: null });
        } catch (error) {
            console.error("Error signing in:", error);
            set({ errorMessage: error.message });
        }
    },

    signOut: async () => {
        try {
            await signOut(auth);
            get().clearStorage();
            localStorage.clear();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error signing out:", error);
            set({ errorMessage: error.message });
        }
    },

    setUser: (user) => set({ user }),

    addTodo: async (content, priority) => {
        const user = get().user;
        const date = dayjs(get().currentDay).format('YYYY-MM-DD');

        try {
            await addDoc(collection(db, "todos"), {
                userId: user.uid,
                content,
                priority: priority || "low",
                date: date,
                done: false,
                createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            });
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },

    updateTodo: async (id, data) => {
        try {
            await updateDoc(doc(db, "todos", id), data);
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error updating document:", error);
            set({ errorMessage: error.message });
        }
    },

    moveToNextDay: async (id) => {
        try {
            const date = dayjs(get().currentDay).add(1, 'day').format('YYYY-MM-DD');
            await updateDoc(doc(db, "todos", id), { date });
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },

    deleteTodo: async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },

    fetchTodos: async () => {
        try {
            const userId = get().user.uid;
            const date = dayjs(get().currentDay).format('YYYY-MM-DD');

            // Fetch todos for the current day
            const todosQuery = query(collection(db, "todos"), where("userId", "==", userId), where("date", "==", date));
            const todosSnapshot = await getDocs(todosQuery);
            const currentDayTodos = todosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Fetch all todos for the user
            const allTodosQuery = query(collection(db, "todos"), where("userId", "==", userId));
            const allTodosSnapshot = await getDocs(allTodosQuery);
            const allTodos = allTodosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            set({ todos: currentDayTodos, allTodos, errorMessage: null });
        } catch (error) {
            console.error("Error fetching todos:", error);    
            set({ errorMessage: error.message });
        }
    },

    removeUserData: async () => {
        try {
            const userId = get().user.uid;
            const todosQuery = query(collection(db, "todos"), where("userId", "==", userId));
            const todosSnapshot = await getDocs(todosQuery);
            todosSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error clearing all todos:", error);
            set({ errorMessage: error.message });
        }
    },

    clearStorage: () => set({ todos: [], user: null }),
}), {
    name: "storage",
}));
