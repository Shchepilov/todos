import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import dayjs from "dayjs";

export const useTodosStore = (set, get) => ({
    todos: [],
    allTodos: [],
    addTodo: async (content, priority, dueDate, autoMove) => {
        const user = get().user;
        const date = dayjs(get().currentDay).format("YYYY-MM-DD");

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
            return get().fetchTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateTodo: async (id, data) => {
        try {
            await updateDoc(doc(db, "todos", id), data);
            return get().fetchTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    moveToNextDay: async (id) => {
        try {
            const date = dayjs(get().currentDay).add(1, "day").format("YYYY-MM-DD");
            await updateDoc(doc(db, "todos", id), { date });
            return get().fetchTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteTodo: async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            return get().fetchTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    fetchTodos: async () => {
        try {
            const userId = get().user.uid;
            const date = dayjs(get().currentDay).format("YYYY-MM-DD");
            const today = dayjs().format("YYYY-MM-DD");

            // Update the date of todos that are not done and have autoMove set to true
            const undoneTodosQuery = query(
                collection(db, "todos"),
                where("userId", "==", userId),
                where("done", "==", false),
                where("autoMove", "==", true)
            );
            const undoneTodosSnapshot = await getDocs(undoneTodosQuery);
            const filteredDocs = undoneTodosSnapshot.docs.filter((doc) => doc.data().date < today);
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

            set({ todos: currentDayTodos, allTodos });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    removeAllTodos: async () => {
        try {
            const userId = get().user.uid;
            const todosQuery = query(collection(db, 'todos'), where("userId", "==", userId));
            const todosSnapshot = await getDocs(todosQuery);

            todosSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            return get().fetchTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    }
});
