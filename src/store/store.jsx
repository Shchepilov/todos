import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import dayjs from "dayjs";

export const useStore = create(persist((set, get) => ({
    isLoading: false,
    user: null,
    currentDay: dayjs(),
    todos: [],
    allTodos: [],
    errorMessage: null,

    setCurrentDay: (currentDay) => set({ currentDay }),

    signIn: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            set({ user: result.user });
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
        } catch (error) {
            console.error("Error signing out:", error);
            set({ errorMessage: error.message });
        }
    },

    setUser: (user) => set({ user }),

    addTodo: async (content, priority) => {
        const user = get().user;
        const date = dayjs(get().currentDay).format('YYYY-MM-DD');
        set({ isLoading: true });

        try {
            await addDoc(collection(db, "todos"), {
                userId: user.uid,
                content,
                priority: priority || "low",
                date: date,
                done: false,
            });
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ errorMessage: error.message, isLoading: false });
        }
    },

    updateTodo: async (id, data) => {
        set({ isLoading: true });

        try {
            await updateDoc(doc(db, "todos", id), data);
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            console.error("Error updating document:", error);
            set({ errorMessage: error.message, isLoading: false });
        }
    },

    moveToNextDay: async (id) => {
        set({ isLoading: true });

        try {
            const date = dayjs(get().currentDay).add(1, 'day').format('YYYY-MM-DD');
            await updateDoc(doc(db, "todos", id), { date });
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ errorMessage: error.message, isLoading: false });
        }
    },

    deleteTodo: async (id) => {
        set({ isLoading: true });

        try {
            await deleteDoc(doc(db, "todos", id));
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ errorMessage: error.message, isLoading: false });
        }
    },

    fetchTodos: async () => {
        set({ isLoading: true });

        try {
            const userId = get().user.uid;
            const date = dayjs(get().currentDay).format('YYYY-MM-DD');
            const q = query(
                collection(db, "todos"), 
                where("userId", "==", userId),
                where("date", "==", date)
            );
            const querySnapshot = await getDocs(q);
            const newTodos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            set({ todos: newTodos, isLoading: false });
        } catch (error) {
            console.error("Error fetching todos:", error);    
            set({ errorMessage: error.message, isLoading: false });
        }
    },

    fetchAllTodos: async () => {
        try {
            const userId = get().user.uid;
            const q = query(collection(db, "todos"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const allTodos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            set({ allTodos });
        } catch (error) {
            console.error("Error fetching all todos:", error);
            set({ errorMessage: error.message });
        }
    },

    clearStorage: () => set({ todos: [], user: null }),
}), {
    name: "storage",
}));
