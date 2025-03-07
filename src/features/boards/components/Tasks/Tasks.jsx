import { useStore } from "@store/store";
import Task from "../Task/Task";
import styles from './Tasks.module.scss';

const Tasks = ({ columnId, boardId }) => {
    const tasksBoard = useStore((state) => state.tasks[boardId]);
    const tasks = tasksBoard.filter((task) => task.columnId === columnId);

    return (
        <ul className={styles.tasks}>
            {tasks && tasks.map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </ul>
    );
};

export default Tasks;
