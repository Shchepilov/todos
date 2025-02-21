import TaskForm from '../TaskForm/TaskForm';
import TaskBoard from '../TaskBoard/TaskBoard';
import styles from './Tasks.module.scss';

const Tasks = () => {
    const columns = ['open', 'inprogress', 'testing','backlog', 'done'];

    return (
        <div className={styles.Tasks}>
            <TaskForm />
            <TaskBoard columns={columns} />
        </div>
    );
};

export default Tasks;
