import { useEffect } from "react";
import { useStore } from "@store/store";
import Task from "../Task/Task";
import styles from './Tasks.module.scss';

const Tasks = ({ columnId, boardId }) => {
    const tasksBoard = useStore((state) => state.tasks[boardId]);
    const tasks = tasksBoard.filter((task) => task.columnId === columnId);
    const fetchBoardData = useStore((state) => state.fetchBoardData);

    useEffect(() => {
        fetchBoardData(boardId);
    }, []);

    return (
        <div className={styles.Tasks}>
            <ul>
                {tasks && tasks.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
