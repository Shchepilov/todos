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

export const useBoardsStore = (set, get) => ({
    boards: [],
    columns: {},
    tasks: {},

    addBoard: async (name) => {
        const user = get().user;

        try {
            await addDoc(collection(db, "boards"), {
                userId: user.uid,
                name,
                columns: [],
                timestamp: serverTimestamp(),
            });
            get().fetchBoards();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    fetchBoards: async () => {
        try {
            const user = get().user;
            const boardsQuery = query(
                collection(db, "boards"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "asc")
            );
            const boardsSnapshot = await getDocs(boardsQuery);
            const boards = boardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            set({ boards: boards });
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
        } catch (error) {
            throw new Error(error.message);
        }
    },

    fetchBoardData: async (boardId) => {
        try {
            const columnsQuery = query(
                collection(db, "columns"),
                where("boardId", "==", boardId),
                orderBy("order", "asc")
            );
            const columnsSnapshot = await getDocs(columnsQuery);
            const columns = columnsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const tasksQuery = query(
                collection(db, "tasks"),
                where("boardId", "==", boardId),
                orderBy("order", "asc")
            );
            const tasksSnapshot = await getDocs(tasksQuery);
            const tasks = tasksSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            set(state => ({
                columns: { ...state.columns, [boardId]: columns },
                tasks: { ...state.tasks, [boardId]: tasks }
            }));
        } catch (error) {
            throw new Error(error.message);
        }
    },

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
