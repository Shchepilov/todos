import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    writeBatch,
    doc,
    serverTimestamp,
    runTransaction,
    arrayUnion,
    arrayRemove,
    deleteField,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { TASKS_COLLECTION, BOARDS_COLLECTION } from "@features/boards/utils/constants";

export const tasksQuery = (boardId) => {
    return query(
        collection(db, TASKS_COLLECTION),
        where("boardId", "==", boardId),
        orderBy("order", "asc")
    );
};

// The counter is read and the task is created in one transaction, which Firestore retries when the
// board changes in between, so two members adding tasks at the same time never get the same number.
export const addTask = (boardId, columnId, taskData) =>
    runTransaction(db, async (transaction) => {
        const boardRef = doc(db, BOARDS_COLLECTION, boardId);
        const boardDoc = await transaction.get(boardRef);

        if (!boardDoc.exists()) {
            throw new Error("Board not found");
        }

        const number = (boardDoc.data().taskCounter ?? 0) + 1;
        const taskRef = doc(collection(db, TASKS_COLLECTION));

        transaction.update(boardRef, { taskCounter: number });
        transaction.set(taskRef, {
            ...taskData,
            boardId,
            columnId,
            number,
            // tasksQuery sorts by order, so every task needs it. The number is unique and keeps
            // creation order without reading all tasks of the column.
            order: number,
            timestamp: serverTimestamp(),
        });

        return taskRef.id;
    });

export const updateTask = async (taskId, taskData) => {
    try {
        await updateDoc(doc(db, TASKS_COLLECTION, taskId), taskData);
    } catch (error) {
        throw new Error(error.message);
    }
};

// The logged total is derived from the list (see getLoggedTime), so a log is one atomic array change
// and no stored total is recalculated from a stale copy. The old stored loggedTime is dropped.
export const addWorkLog = (taskId, log) =>
    updateDoc(doc(db, TASKS_COLLECTION, taskId), { workLogsList: arrayUnion(log), loggedTime: deleteField() });

// arrayRemove matches the whole element, so the log object comes from the task snapshot.
export const removeWorkLog = (taskId, log) =>
    updateDoc(doc(db, TASKS_COLLECTION, taskId), { workLogsList: arrayRemove(log), loggedTime: deleteField() });

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
