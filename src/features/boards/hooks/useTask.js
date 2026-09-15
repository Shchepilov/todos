import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import { TASKS_COLLECTION } from "@features/boards/utils/constants";

// Reads one task from Firestore, so an open task can tell "still loading" from "does not exist".
// The tasks in the store can't tell: they may come from local storage or from the previous board.
const useTask = (taskId) => {
    const [taskSnapshot, taskLoading, taskError] = useDocument(doc(db, TASKS_COLLECTION, taskId));
    const task = taskSnapshot?.exists() ? { id: taskSnapshot.id, ...taskSnapshot.data() } : null;

    return { task, taskLoading, taskError };
};

export default useTask;
