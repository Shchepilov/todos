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
    error: null,
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
        const date = get().currentDay.format('YYYY-MM-DD');
        
        await addDoc(collection(db, "todos"), {
          userId: user.uid,
          content,
          priority: priority || "low", // Default priority
          date: date,
          done: false,
        })

        get().fetchTodos();
        get().fetchAllTodos();
    },
    updateTodo: async (id, data) => {
        try {
            await updateDoc(doc(db, "todos", id), data);
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ error });
        }
    },
    moveToNextDay: async (id) => {
        try {
            const date = get().currentDay.add(1, 'day').format('YYYY-MM-DD');
            await updateDoc(doc(db, "todos", id), { date });
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ error });
        }
    },
    deleteTodo: async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            get().fetchTodos();
            get().fetchAllTodos();
        } catch (error) {
            set({ error });
        }
    },
    fetchTodos: async () => {
        set({ isLoading: true });

        try {
            const userId = get().user.uid;
            const date = get().currentDay.format('YYYY-MM-DD');
            const q = query(
                collection(db, "todos"), 
                where("userId", "==", userId),
                where("date", "==", date));
            const querySnapshot = await getDocs(q);
            const newTodos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            set({ todos: newTodos, isLoading: false });
        } catch (error) {
            set({ error, isLoading: false });
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
            set({ error });
        }
    },
    clearStorage: () => set({ todos: [], user: null}),
}),
{
    name: "storage",
})));
