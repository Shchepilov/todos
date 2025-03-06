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

export const useBoardStore = (set, get) => ({
    boards: [],

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
    }
});
