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
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { BOARDS_COLLECTION } from "@features/boards/utils/constants";

export const addBoard = async (userId, name) => {
    try {
        const docRef = await addDoc(collection(db, BOARDS_COLLECTION), {
            userId,
            name,
            watchers: [],
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

export const deleteBoard = async (id) => {
    try {
        await deleteDoc(doc(db, BOARDS_COLLECTION, id));
        //delete all columns and tasks associated with the board
    } catch (error) {
        throw new Error(error.message);
    }
}
