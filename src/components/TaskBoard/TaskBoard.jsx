import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskBoard.module.scss';

const TaskBoard = () => {
    return (
        <div className={styles.TaskBoard}>
            TaskBoard
            <TaskItem />
        </div>
    );
};

export default TaskBoard;
