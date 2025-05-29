import { useEffect } from "react";
import { useStore } from "@store/store";
import { useCollection } from 'react-firebase-hooks/firestore';

import { columnsQuery } from "@features/boards/services/columnsQuery";
import { tasksQuery } from "@features/boards/services/tasksQuery";

const useBoardData = (boardId) => {
    const setColumns = useStore((state) => state.setColumns);
    const setTasks = useStore((state) => state.setTasks);

    const boardColumnsQuery = columnsQuery(boardId);
    const boardTasksQuery = tasksQuery(boardId);

    const [columnsSnapshot, columnsLoading, columnsError] = useCollection(boardColumnsQuery);
    const [tasksSnapshot, tasksLoading, tasksError] = useCollection(boardTasksQuery);

    useEffect(() => {
        if (!columnsSnapshot) return;
        const columns = columnsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setColumns(columns);
        
    }, [columnsSnapshot, boardId]);

    useEffect(() => {
        if (!tasksSnapshot) return;
        const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasks);
        
    }, [tasksSnapshot, boardId]);

    return { columnsLoading, columnsError, tasksLoading, tasksError };
}
 
export default useBoardData;
