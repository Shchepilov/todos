import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db, auth, googleAuthProvider, githubAuthProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import dayjs from "dayjs";

export const useStore = create(persist((set, get) => ({
    user: null,
    currentDay: dayjs(),
    todos: [],
    allTodos: [],
    allNotes: [],
    errorMessage: null,

    setCurrentDay: (currentDay) => set({ currentDay }),

    googleSignIn: async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            set({ user: result.user, errorMessage: null });
        } catch (error) {
            console.error("Error signing in:", error);
            set({ errorMessage: error.message });
        }
    },

    githubSignIn: async () => {
        try {
            const result = await signInWithPopup(auth, githubAuthProvider);
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
            window.location.href = "/";
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error signing out:", error);
            set({ errorMessage: error.message });
        }
    },

    setUser: (user) => set({ user }),

    addTodo: async (content, priority, dueDate, autoMove) => {
        const user = get().user;
        const date = dayjs(get().currentDay).format('YYYY-MM-DD');

        try {
            await addDoc(collection(db, "todos"), {
                userId: user.uid,
                content,
                priority: priority || "low",
                date: date,
                dueDate,
                done: false,
                autoMove,
                timestamp: serverTimestamp(),
            });
            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },

    addNote: async (content) => {
        const user = get().user;

        try {
            await addDoc(collection(db, "notes"), { 
                userId: user.uid, 
                content,
                timestamp: serverTimestamp()
            });
            get().fetchNotes();
            set({ errorMessage: null });
        } catch (error) {
            set({ errorMessage: error.message });
        }
    },

    fetchNotes: async () => {
        try {   
            const user = get().user;
            const notesQuery = query(
                collection(db, "notes"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "asc")
            );
            const notesSnapshot = await getDocs(notesQuery);
            const notes = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            set({ allNotes: notes, errorMessage: null });
        } catch (error) {
            console.error("Error fetching notes:", error);
            set({ errorMessage: error.message });
        }
    },

    updateNote: async (id, data) => {
        try {
            await updateDoc(doc(db, "notes", id), data);
            get().fetchNotes();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error updating note:", error);
            set({ errorMessage: error.message });
        }
    },

    deleteNote: async (id) => {
        try {
            await deleteDoc(doc(db, "notes", id));
            get().fetchNotes();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error deleting note:", error);
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
            const today = dayjs().format('YYYY-MM-DD');

            // Update the date of todos that are not done and have autoMove set to true
            const undoneTodosQuery = query(collection(db, "todos"), where("userId", "==", userId), where("done", "==", false), where("autoMove", "==", true));
            const undoneTodosSnapshot = await getDocs(undoneTodosQuery);
            const filteredDocs = undoneTodosSnapshot.docs.filter(doc => doc.data().date < today);
            const batch = writeBatch(db);
            filteredDocs.forEach((doc) => {
                batch.update(doc.ref, { date: today });
            });
            await batch.commit();

            // Fetch todos for the current day
            const todosQuery = query(
                collection(db, "todos"),
                where("userId", "==", userId),
                where("date", "==", date),
                orderBy("priority", "desc"),
                orderBy("timestamp", "desc")
            );
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

    removeUserData: async (type) => {
        try {
            const userId = get().user.uid;
            const todosQuery = query(collection(db, type), where("userId", "==", userId));
            const todosSnapshot = await getDocs(todosQuery);
            todosSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            if (type === "todos") {
                get().fetchTodos();
            } else if (type === "notes") {
                get().fetchNotes();
            }

            get().fetchTodos();
            set({ errorMessage: null });
        } catch (error) {
            console.error("Error clearing:", error);
            set({ errorMessage: error.message });
        }
    },

    clearStorage: () => set({ todos: [], user: null }),
}), {
    name: "storage",
}));
