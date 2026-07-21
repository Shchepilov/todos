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
    FieldPath,
    deleteField,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { BOARDS_COLLECTION } from "@features/boards/utils/constants";
import { deleteAllColumns } from "@features/boards/services/columnsQuery";
import { deleteAllBoardTasks } from "@features/boards/services/tasksQuery";

export const addBoard = async (userId, name, prefix, owner) => {
    try {
        const docRef = await addDoc(collection(db, BOARDS_COLLECTION), {
            userId,
            name,
            prefix,
            owner,
            watchers: [],
            watchersData: [],
            sprints: [],
            taskCounter: 0,
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

// Each sprint keeps its own planning session under board.planning[sprintId].
// FieldPath is used instead of dot notation because sprint ids are generated from
// user input and may contain characters that are invalid in a field path string.
export const updateSprintPlanning = async (boardId, sprintId, planning) => {
    if (!sprintId) return;

    try {
        await updateDoc(
            doc(db, BOARDS_COLLECTION, boardId),
            new FieldPath('planning', sprintId),
            planning || deleteField()
        );
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
