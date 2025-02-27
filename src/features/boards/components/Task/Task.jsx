import styles from './Task.module.scss';

const Task = ({ task }) => {
    return (
        <div className={styles.item}>
            <p><strong>{task.title}</strong></p>
        </div>
    );
};

export default Task;
