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
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

export const useTaskStore = (set, get) => ({
    tasks: {},

    addTask: async (boardId, columnId, taskData) => {
        try {
            const tasksRef = collection(db, "tasks");
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

            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateTask: async (boardId, taskId, taskData) => {
        try {
            await updateDoc(doc(db, "tasks", taskId), taskData);
            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteTask: async (taskId, boardId) => {
        try {
            await deleteDoc(doc(db, "tasks", taskId));
            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteAllColumnTasks: async (columnId) => {
        try {
            const tasksQuery = query(
                collection(db, "tasks"),
                where("columnId", "==", columnId)
            );
            const tasksSnapshot = await getDocs(tasksQuery);
            tasksSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteAllBoardTasks: async (boardId) => {
        try {
            const tasksQuery = query(
                collection(db, "tasks"),
                where("boardId", "==", boardId)
            );
            const tasksSnapshot = await getDocs(tasksQuery);
            tasksSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    moveTask: async (taskId, newColumnId, newOrder) => {
        try {
            await updateDoc(doc(db, "tasks", taskId), {
                columnId: newColumnId,
                order: newOrder,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
});
