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

export const useColumnStore = (set, get) => ({
    columns: [],

    addColumn: async (boardId, name) => {
        try {
            const columnsRef = collection(db, "columns");
            const columnsQuery = query(
                columnsRef,
                where("boardId", "==", boardId)
            );
            const columnsSnapshot = await getDocs(columnsQuery);
            
            await addDoc(columnsRef, {
                name,
                boardId,
                order: columnsSnapshot.size,
                timestamp: serverTimestamp()
            });
            
            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteColumn: async (columnId, boardId) => {
        try {
            await deleteDoc(doc(db, "columns", columnId));
            await get().deleteAllColumnTasks(columnId);
            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteAllColumns: async (boardId) => {
        try {
            const columnsQuery = query(
                collection(db, "columns"),
                where("boardId", "==", boardId)
            );
            const columnsSnapshot = await getDocs(columnsQuery);
            columnsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await get().fetchBoardData(boardId);
        } catch (error) {
            throw new Error(error.message);
        }
    },
});
