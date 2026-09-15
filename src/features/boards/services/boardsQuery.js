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
    arrayUnion,
    arrayRemove,
    runTransaction,
} from "firebase/firestore";
import { db } from "@baseUrl/firebase";

import { BOARDS_COLLECTION, LEGACY_PLANNING_FIELDS } from "@features/boards/utils/constants";
import { deleteAllColumns } from "@features/boards/services/columnsQuery";
import { deleteAllBoardTasks } from "@features/boards/services/tasksQuery";
import { generateId } from "@features/boards/utils/helpers";

const boardRef = (boardId) => doc(db, BOARDS_COLLECTION, boardId);

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

// Boards created before planning became sprint scoped keep a single session
// directly under board.planning - drop those leftover fields, the sprint map stays intact.
export const clearLegacyPlanning = async (boardId) => {
    try {
        await updateDoc(doc(db, BOARDS_COLLECTION, boardId), Object.fromEntries(
            LEGACY_PLANNING_FIELDS.map(field => [`planning.${field}`, deleteField()])
        ));
    } catch (error) {
        throw new Error(error.message);
    }
}

// Shared board data is changed one field at a time instead of rewriting a whole array or map
// from the local snapshot, so edits made at the same time by other members are not lost.

// Votes are a map keyed by email, so each member writes only their own vote.
export const castPlanningVote = (boardId, sprintId, email, vote) =>
    updateDoc(boardRef(boardId), new FieldPath('planning', sprintId, 'votes', email), vote);

export const revealPlanningVotes = (boardId, sprintId) =>
    updateDoc(boardRef(boardId), new FieldPath('planning', sprintId, 'revealed'), true);

export const addWatcher = (boardId, watcherEmail, watcherName) =>
    updateDoc(boardRef(boardId), {
        watchers: arrayUnion(watcherEmail),
        watchersData: arrayUnion({ watcherEmail, watcherName }),
    });

// arrayRemove matches whole elements, so the member's entries are taken from the board snapshot.
export const removeWatcher = (board, email) => {
    const entries = board.watchersData.filter(watcher => watcher.watcherEmail === email);

    return updateDoc(boardRef(board.id), {
        watchers: arrayRemove(email),
        ...(entries.length > 0 && { watchersData: arrayRemove(...entries) }),
    });
};

export const addSprint = (boardId, sprint) =>
    updateDoc(boardRef(boardId), { sprints: arrayUnion(sprint) });

// The sprint's retrospective is removed together with the sprint.
export const removeSprint = (boardId, sprint) =>
    updateDoc(boardRef(boardId),
        'sprints', arrayRemove(sprint),
        new FieldPath('retrospective', sprint.id), deleteField());

// Retrospective items live in board.retrospective[sprintId][type][itemId].
const retrospectiveItemPath = (sprintId, type, itemId, ...field) =>
    new FieldPath('retrospective', sprintId, type, String(itemId), ...field);

// Items are a map, so createdAt keeps them in the order they were added.
export const addRetrospectiveItem = (boardId, sprintId, type, item) =>
    updateDoc(boardRef(boardId), retrospectiveItemPath(sprintId, type, generateId()), { ...item, createdAt: Date.now() });

export const deleteRetrospectiveItem = (boardId, sprintId, type, itemId) =>
    updateDoc(boardRef(boardId), retrospectiveItemPath(sprintId, type, itemId), deleteField());

export const toggleRetrospectiveVote = (boardId, sprintId, type, itemId, email, hasVoted) =>
    updateDoc(boardRef(boardId),
        retrospectiveItemPath(sprintId, type, itemId, 'voteList'),
        hasVoted ? arrayRemove(email) : arrayUnion(email));

// Retrospective items used to live in board.sprints[].retrospective, so every change rewrote
// the whole sprints array. This moves them to board.retrospective once. The transaction reads
// the board again, so a concurrent change is not lost and a second run finds nothing to move.
export const migrateLegacyRetrospective = (boardId) =>
    runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(boardRef(boardId));
        const sprints = snapshot.data()?.sprints ?? [];

        if (!sprints.some(sprint => 'retrospective' in sprint)) return;

        const items = sprints.flatMap(sprint =>
            Object.entries(sprint.retrospective ?? {}).flatMap(([type, list]) =>
                (list ?? []).map(({ id, ...item }, index) => [
                    retrospectiveItemPath(sprint.id, type, id ?? generateId()),
                    // Old items keep their order and stay ahead of new ones, which use Date.now().
                    { ...item, createdAt: index },
                ])
            )
        );

        transaction.update(boardRef(boardId),
            'sprints', sprints.map(({ id, name }) => ({ id, name })),
            ...items.flat());
    });

export const deleteBoard = async (boardId) => {
    try {
        await deleteDoc(doc(db, BOARDS_COLLECTION, boardId));
        await deleteAllColumns(boardId);
        await deleteAllBoardTasks(boardId);
    } catch (error) {
        throw new Error(error.message);
    }
}
