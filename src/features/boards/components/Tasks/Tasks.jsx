import { useStore } from "@store/store";
import { AnimatePresence } from "framer-motion";
import Task from "../Task/Task";
import styles from './Tasks.module.scss';

const Tasks = ({ columnId, boardId }) => {
    const tasksBoard = useStore((state) => state.tasks[boardId]);
    const tasks = tasksBoard.filter((task) => task.columnId === columnId);
    const sortedList = tasks.sort((a, b) => b.priority - a.priority);
    
    return (
        <ul className={styles.tasks}>
            <AnimatePresence>
                {tasks && sortedList.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </AnimatePresence>
        </ul>
    );
};

export default Tasks;
