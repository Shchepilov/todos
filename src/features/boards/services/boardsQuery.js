import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { BOARDS_COLLECTION } from "@features/boards/utils/constants";
import { deleteAllColumns } from "@features/boards/services/columnsQuery";
import { deleteAllBoardTasks } from "@features/boards/services/tasksQuery";

export const addBoard = async (userId, name) => {
    try {
        const docRef = await addDoc(collection(db, BOARDS_COLLECTION), {
            userId,
            name,
            watchers: [],
            watchersData: [],
            timestamp: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const boardsQuery = (userId) => {
    return query(
        collection(db, BOARDS_COLLECTION),
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
    );
}

export const watchBoardsQuery = (userEmail) => {
    return query(
        collection(db, BOARDS_COLLECTION),
        where("watchers", "array-contains", userEmail),
        orderBy("timestamp", "asc")
    );
}

export const updateBoard = async (id, data) => {
    try {
        await updateDoc(doc(db, BOARDS_COLLECTION, id), data);
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteBoard = async (boardId) => {
    try {
        await deleteDoc(doc(db, BOARDS_COLLECTION, boardId));
        await deleteAllColumns(boardId);
        await deleteAllBoardTasks(boardId);
    } catch (error) {
        throw new Error(error.message);
    }
}
