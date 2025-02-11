

import TaskForm from '../../components/TaskForm/TaskForm';
import TaskBoard from '../../components/TaskBoard/TaskBoard';
import styles from './Tasks.module.scss';

const Tasks = () => {
    return (
        <div className={styles.Tasks}>
            <TaskForm />
            <TaskBoard />
        </div>
    );
};

export default Tasks;
