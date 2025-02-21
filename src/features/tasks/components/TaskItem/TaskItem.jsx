import styles from './TaskItem.module.scss';

const TaskItem = ({ task }) => {
    return (
        <div className={styles.item}>
            <p><strong>{task.title}</strong></p>
            <p>{task.status}</p>
        </div>
    );
};

export default TaskItem;
