import { useStore } from "@store/store";
import styles from './Task.module.scss';

const Task = ({ task }) => {
    const removeTask = useStore((state) => state.removeTask);

    return (
        <div className={styles.item}>
            <p>{task.title}</p>
            <button onClick={() => removeTask(task.id, task.boardId)}>x</button>
        </div>
    );
};

export default Task;
