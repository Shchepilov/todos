import { useStore } from "@store/store";
import styles from './Task.module.scss';

const Task = ({ task }) => {
    const deleteTask = useStore((state) => state.deleteTask);

    return (
        <div className={styles.item}>
            <p>{task.title}</p>
            <button onClick={() => deleteTask(task.id, task.boardId)}>x</button>
        </div>
    );
};

export default Task;
