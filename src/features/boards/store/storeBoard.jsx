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

export const useBoardStore = (set, get) => ({
    boards: [],
    activeBoardId: null,
    setBoards: (boards) => set({ boards }),
    setActiveBoardId: (id) => set({ activeBoardId: id }),

    fetchBoardData: (boardId) => {
        try {
            set({ activeBoardId: boardId });

            // Create column listener
            const columnsQuery = query(
                collection(db, "columns"),
                where("boardId", "==", boardId),
                orderBy("order", "asc")
            );
            const unsubscribeColumns = onSnapshot(columnsQuery, (columnsSnapshot) => {
                const columns = columnsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                set({ columns });
            }, (error) => {
                console.error("Error listening to columns:", error);
            });

            // Create tasks listener
            const tasksQuery = query(
                collection(db, "tasks"),
                where("boardId", "==", boardId),
                orderBy("order", "asc")
            );
            const unsubscribeTasks = onSnapshot(tasksQuery, (tasksSnapshot) => {
                const tasks = tasksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                set({ tasks });
            }, (error) => {
                console.error("Error listening to tasks:", error);
            });

            // Store listeners for cleanup
            set({ 
                columnListeners: { ...get().columnListeners, [boardId]: unsubscribeColumns },
                taskListeners: { ...get().taskListeners, [boardId]: unsubscribeTasks }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }   
});
