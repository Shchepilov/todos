import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskColumn.module.scss';


const TaskColumn = ({ column, tasks }) => {
    const columnTasks = tasks.filter((task) => task.status === column);

    return (
        <div className={styles.column}>
            {column && <h3>{column}</h3>}
            {columnTasks && columnTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};

export default TaskColumn;
