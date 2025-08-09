import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import TaskCopyMenu from "./TaskCopyMenu";
import { motion } from "framer-motion";
import { useStore } from "@store/store";
import ProgressBar from "@features/boards/components/ProgressBar/ProgressBar";
import TypeBadge from "@features/boards/components/Task/TypeBadge";
import TaskActions from "@features/boards/components/Task/TaskActions";
import TaskAssignment from "@features/boards/components/Task/TaskAssignment";
import TaskEditForm from "@features/boards/components/Task/TaskEditForm";
import { useDragAndDrop } from "@features/boards/hooks/useDragAndDrop";
import styles from './Task.module.scss';

const Task = ({ task }) => {
    const columns = useStore((state) => state.columns);
    const activeBoardId = useStore((state) => state.activeBoardId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === activeBoardId);
    const isWatcher = activeBoard?.isWatcher || false;

    const navigate = useNavigate();
    const { register } = useForm();
    const { taskRef, handleDragStart, handleDragEnd } = useDragAndDrop(task, styles);

    const handleTaskDetails = () => {
        navigate(`/boards/${task.boardId}/tasks/${task.id}`);
    };


    if (!activeBoard) return;

    return (
        <motion.li
            ref={taskRef}
            layout
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={styles.item} 
            data-priority={task.priority}>
                
            <header className={styles.header}>
                <TypeBadge type={task.type} />

                <div className={styles.title}>
                    <span role="button" onClick={handleTaskDetails} className={`${styles.prefix} ${styles.title}`}>{activeBoard.prefix}-{task.number}</span>
                    <TaskCopyMenu task={task} activeBoard={activeBoard} />
                </div>

                <div draggable="true"
                     onDragStart={handleDragStart}
                     onDragEnd={handleDragEnd}
                     className={styles.dragHandle}>

                    <DragHandleDots2Icon width={20} height={20} />
                </div>
            </header>

            <span role="button" className={styles.title} onClick={handleTaskDetails}>{task.title}</span>

            {(task.estimation && task.loggedTime) &&  (
                <ProgressBar estimation={task.estimation} loggedTime={task.loggedTime} />
            )}
            
            <TaskEditForm 
                task={task}
                columns={columns}
                register={register}
                className={styles.select}
            />
            
            <footer className={styles.footer}>
                <TaskAssignment 
                    task={task}
                    activeBoard={activeBoard}
                    register={register}
                    className={styles.select}
                />

                <TaskActions 
                    task={task}
                    isWatcher={isWatcher}
                    className={styles.deleteButton}
                />
            </footer>
        </motion.li>
    );
};

export default Task;
