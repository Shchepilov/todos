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
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    droppedColumnId: null,
    setDroppedColumnId: (columnId) => set({ droppedColumnId: columnId })
});
