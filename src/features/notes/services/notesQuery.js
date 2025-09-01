import {
    collection,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import { NOTE_COLLECTION } from "@features/notes/utils/constants";

export const notesQuery = (userId) => {
    return query(
        collection(db, NOTE_COLLECTION),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
    );
}

export const addNote = async (userId, content) => {
    try {
        await addDoc(collection(db, NOTE_COLLECTION), {
            userId,
            ...content,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateNote = async (id, data) => {
    try {
        await updateDoc(doc(db, NOTE_COLLECTION, id), data);
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteNote = async (id) => {
    try {
        await deleteDoc(doc(db, NOTE_COLLECTION, id));
    } catch (error) {
        throw new Error(error.message);
    }
}
