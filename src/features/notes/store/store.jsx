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

export const useNotesStore = (set, get) => ({
    allNotes: [],

    addNote: async (content) => {
        const user = get().user;

        try {
            await addDoc(collection(db, "notes"), {
                userId: user.uid,
                ...content,
                timestamp: serverTimestamp(),
            });
            await get().fetchNotes();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    fetchNotes: async () => {
        try {
            const user = get().user;
            const notesQuery = query(
                collection(db, "notes"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "desc")
            );
            const notesSnapshot = await getDocs(notesQuery);
            const notes = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            set({ allNotes: notes });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateNote: async (id, data) => {
        try {
            await updateDoc(doc(db, "notes", id), data);
            await get().fetchNotes();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteNote: async (id) => {
        try {
            await deleteDoc(doc(db, "notes", id));
            await get().fetchNotes();
        } catch (error) {
            throw new Error(error.message);
        }
    }
});
