import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    writeBatch,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { TASKS_COLLECTION } from "@features/boards/utils/constants";

export const tasksQuery = (boardId) => {
    return query(
        collection(db, TASKS_COLLECTION),
        where("boardId", "==", boardId),
        orderBy("order", "asc")
    );
};

export const addTask = async (boardId, columnId, taskData) => {
    try {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const tasksQuery = query(
            tasksRef,
            where("columnId", "==", columnId)
        );
        const tasksSnapshot = await getDocs(tasksQuery);

        await addDoc(tasksRef, {
            ...taskData,
            boardId,
            columnId,
            order: tasksSnapshot.size,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        await updateDoc(doc(db, TASKS_COLLECTION, taskId), taskData);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteAllColumnTasks = async (columnId) => {
    try {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const tasksQuery = query(
            tasksRef,
            where("columnId", "==", columnId)
        );
        const tasksSnapshot = await getDocs(tasksQuery);

        const batch = writeBatch(db);
        tasksSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteAllBoardTasks = async (boardId) => {
    try {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const tasksQuery = query(
            tasksRef,
            where("boardId", "==", boardId)
        );
        const tasksSnapshot = await getDocs(tasksQuery);

        const batch = writeBatch(db);
        tasksSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        throw new Error(error.message);
    }
};
