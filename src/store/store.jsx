import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import dayjs from 'dayjs';

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
import { db, auth, provider } from "../firebase";
import { persist } from "zustand/middleware";
import { signInWithPopup, signOut } from "firebase/auth"; 

export const useStore = create(persist(devtools((set, get) => ({
    isLoading: false,
    user: null,
    currentDay: dayjs(),
    setCurrentDay: (currentDay) => set({ currentDay }),
    todos: [],
    allTodos: [],
    errorMessage: null,
    signIn: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            set({
                user: result.user
            });
        } catch (error) {
            console.error("Error signing in:", error);
        }
    },
    signOut: async () => {
        try {
            await signOut(auth);
            get().clearStorage();
            localStorage.clear();
        } catch (error) {
            console.error("Error signing out:", error);
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
                priority: priority || "low", // Default priority
                date: date,
                done: false,
            })

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
                where("date", "==", date));
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
            const q = query(
                collection(db, "todos"), 
                where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const newTodos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            
            set({ allTodos: newTodos });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },
    clearStorage: () => set({ todos: [], user: null}),
}),
{
    name: "storage",
})));
