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
    columnListeners: {},
    taskListeners: {},

    addBoard: async (name) => {
        const user = get().user;

        try {
            const docRef = await addDoc(collection(db, "boards"), {
                userId: user.uid,
                name,
                watchers: [],
                timestamp: serverTimestamp(),
            });
            await get().fetchBoards();
            return docRef.id;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    fetchBoards: async () => {
        try {
            const user = get().user;
            const userEmail = user.providerData[0].email;

            const boardsQuery = query(
                collection(db, "boards"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "asc")
            );
            const boardsSnapshot = await getDocs(boardsQuery);
            const boards = boardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const watchBoardsQuery = query(
                collection(db, "boards"),
                where("watchers", "array-contains", userEmail),
                orderBy("timestamp", "asc")
            );
            const watchBoardsSnapshot = await getDocs(watchBoardsQuery);
            const watchBoards = watchBoardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), isWatcher: true }));
            const allBoards = [...boards, ...watchBoards];

            set({ boards: allBoards });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateBoard: async (id, data) => {
        try {
            await updateDoc(doc(db, "boards", id), data);
            get().fetchBoards();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteBoard: async (id) => {
        try {
            await deleteDoc(doc(db, "boards", id));
            await get().deleteAllColumns(id);
            await get().deleteAllBoardTasks(id);
            await get().fetchBoards();

            set({ activeBoardId: null });
        } catch (error) {
            throw new Error(error.message);
        }
    },

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
    },

    cleanupBoardListeners: (boardId) => {
        if (get().columnListeners[boardId]) {
            get().columnListeners[boardId]();
            const newColumnListeners = { ...get().columnListeners };
            delete newColumnListeners[boardId];
            set({ columnListeners: newColumnListeners });
        }
        
        if (get().taskListeners[boardId]) {
            get().taskListeners[boardId]();
            const newTaskListeners = { ...get().taskListeners };
            delete newTaskListeners[boardId];
            set({ taskListeners: newTaskListeners });
        }
    }
});
