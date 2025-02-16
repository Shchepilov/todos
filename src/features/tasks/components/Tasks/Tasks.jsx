import TaskForm from '../../components/TaskForm/TaskForm';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
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
