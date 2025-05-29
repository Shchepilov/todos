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

import { COLUMNS_COLLECTION } from "@features/boards/utils/constants";
import { deleteAllColumnTasks } from "@features/boards/services/tasksQuery";

export const columnsQuery = (boardId) => {
    return query(
        collection(db, COLUMNS_COLLECTION),
        where("boardId", "==", boardId),
        orderBy("order", "asc")
    );
};

export const addColumn = async (boardId, name) => {
    try {
        const columnsRef = collection(db, COLUMNS_COLLECTION);
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
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteColumn = async (columnId) => {
    try {
        await deleteDoc(doc(db, COLUMNS_COLLECTION, columnId));
        await deleteAllColumnTasks(columnId);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateColumn = async (columnId, data) => {
    try {
        await updateDoc(doc(db, COLUMNS_COLLECTION, columnId), data);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteAllColumns = async (boardId) => {
    try {
        const columnsQuery = query(
            collection(db, COLUMNS_COLLECTION),
            where("boardId", "==", boardId)
        );
        const columnsSnapshot = await getDocs(columnsQuery);
        columnsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    } catch (error) {
        throw new Error(error.message);
    }
};
