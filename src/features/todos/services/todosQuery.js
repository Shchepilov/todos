import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    writeBatch,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import { TODO_COLLECTION } from "@features/todos/utils/constants";
import dayjs from "dayjs";


export const addTodo = async (userId, content, priority, dueDate, autoMove, date) => {
    try {
        await addDoc(collection(db, TODO_COLLECTION), {
            userId,
            content,
            priority: priority || "low",
            date: date,
            dueDate,
            done: false,
            autoMove,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateTodo = async (id, data) => {
    try {
        await updateDoc(doc(db, TODO_COLLECTION, id), {
            ...data,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const moveToNextDay = async (id, currentDay) => {
    try {
        const date = dayjs(currentDay).add(1, "day").format("YYYY-MM-DD");
        await updateDoc(doc(db, TODO_COLLECTION, id), { date });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteTodo = async (id) => {
    try {
        await deleteDoc(doc(db, TODO_COLLECTION, id));
    } catch (error) {
        throw new Error(error.message);
    }
};


export const removeAllUserTodos = async (userId) => {
    try {
        const todosQuery = query(
            collection(db, TODO_COLLECTION), 
            where("userId", "==", userId)
        );

        const todosSnapshot = await getDocs(todosQuery);

        if (todosSnapshot.docs.length > 0) {
            const batch = writeBatch(db);
            todosSnapshot.docs.forEach((docRef) => {
                batch.delete(docRef.ref);
            });
            await batch.commit();
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchAllTodos = (userId) => {
    return query(
        collection(db, TODO_COLLECTION),
        where("userId", "==", userId)
    );
};

export const updateAutoMoveTodos = async (userId) => {
    try {
        const today = dayjs().format("YYYY-MM-DD");
        
        const undoneTodosQuery = query(
            collection(db, TODO_COLLECTION),
            where("userId", "==", userId),
            where("done", "==", false),
            where("autoMove", "==", true)
        );
        
        const undoneTodosSnapshot = await getDocs(undoneTodosQuery);
        const filteredDocs = undoneTodosSnapshot.docs.filter((doc) => doc.data().date < today);
        
        if (filteredDocs.length > 0) {
            const batch = writeBatch(db);
            filteredDocs.forEach((docRef) => {
                batch.update(docRef.ref, { 
                    date: today,
                    lastUpdated: serverTimestamp()
                });
            });
            await batch.commit();
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
