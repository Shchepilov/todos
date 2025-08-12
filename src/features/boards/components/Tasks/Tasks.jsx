import { useStore } from "@store/store";
import { AnimatePresence } from "framer-motion";
import Task from "../Task/Task";
import styles from './Tasks.module.scss';

const Tasks = ({ columnId }) => {
    const tasksBoard = useStore((state) => state.tasks);
    const activeBoardId = useStore((state) => state.activeBoardId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === activeBoardId);
    const filters = useStore((state) => state.taskFilters[activeBoardId]) || {
        assignee: [],
        type: [],
        priority: []
    };
    
    const filteredTasks = tasksBoard.filter((task) => {
        if (task.columnId !== columnId) return false;

        if (activeBoard?.activeSprint && task.sprint !== activeBoard.activeSprint) return false;
        
        if (filters.assignee?.length > 0 && !filters.assignee.includes(task.assignee)) return false;
        
        if (filters.type?.length > 0 && !filters.type.includes(task.type)) return false;
        
        if (filters.priority?.length > 0 && !filters.priority.includes(Number(task.priority))) return false;
        
        return true;
    });
    
    const sortedList = filteredTasks.sort((a, b) => b.priority - a.priority);
    
    return (
        <ul className={styles.tasks}>
            <AnimatePresence>
                {filteredTasks && sortedList.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </AnimatePresence>
        </ul>
    );
};

export default Tasks;
