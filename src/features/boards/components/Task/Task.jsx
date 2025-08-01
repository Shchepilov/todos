import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { DragHandleDots2Icon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useStore } from "@store/store";
import Button from "@components/Button/Button";
import Select from "@components/Select/Select";
import { deleteTask, updateTask } from '@features/boards/services/tasksQuery';
import ProgressBar from "@features/boards/components/ProgressBar/ProgressBar";
import TypeBadge from "@features/boards/components/Task/TypeBadge";
import { TASK_STATUS } from "@features/boards/utils/constants";
import styles from './Task.module.scss';
import Row from "@components/Row/Row";

const Task = ({ task }) => {
    const droppedColumnId = useStore((state) => state.droppedColumnId);
    const setDroppedColumnId = useStore((state) => state.setDroppedColumnId);
    const columns = useStore((state) => state.columns);
    const activeBoardId = useStore((state) => state.activeBoardId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === activeBoardId);
    const isWatcher = activeBoard?.isWatcher || false;

    const navigate = useNavigate();
    const taskRef = useRef(null);

    const handleChangeColumn = (e) => updateTask(task.id, { columnId: e.target.value });
    const handleChangePriority = (e) => updateTask(task.id, { priority: e.target.value });
    const handleDeleteTask = () => deleteTask(task.id);
    const handleChangeAssignee = (e) => updateTask(task.id, { assignee: e.target.value });

    const handleTaskDetails = () => {
        navigate(`/boards/${task.boardId}/tasks/${task.id}`);
    };

    const handleDragStart = (e) => {
        setDroppedColumnId(task.columnId);
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("columnId", task.columnId);
        
        taskRef.current.classList.add(styles.dragging);
        const taskWidth = taskRef.current.offsetWidth;
    
        e.dataTransfer.setDragImage(taskRef.current, taskWidth - 15, 20);
    };

    const handleDragEnd = () => {
        if (task.columnId === droppedColumnId) {
            taskRef.current.classList.remove(styles.dragging);
        }
    };

    const { register } = useForm();

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

                <span role="button" onClick={handleTaskDetails} className={`${styles.prefix} ${styles.title}`}>{activeBoard.prefix}-{task.number}</span>

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
            
            <Row gap='small'>
                <Select register={register}
                        className={styles.select} 
                        name="taskPriority"
                        items={TASK_STATUS}
                        onChange={handleChangePriority}
                        value={task.priority} />
                <Select register={register}
                        className={styles.select}
                        name="columnId"
                        items={columns}
                        valueKey="id"
                        onChange={handleChangeColumn}
                        value={task.columnId} />
            </Row>

            
            <footer className={styles.footer}>
                {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                    <>
                        <PersonIcon width={18} height={18} />
                        
                        <Select register={register}
                                id="taskAssignee"
                                className={styles.select}
                                name="taskAssignee" 
                                items={activeBoard.watchersData} 
                                nameKey="watcherName" 
                                valueKey="watcherName" 
                                onChange={handleChangeAssignee}
                                value={task.assignee}>
                            <option value="unassigned">Unassigned</option>
                            <option value={activeBoard.owner.name}>{activeBoard.owner.name}</option>
                        </Select>
                    </>
                )}

                {!isWatcher && (
                    <Button variation="transparent" className={styles.deleteButton} size="small" aria-label="Delete task">
                        <TrashIcon onClick={handleDeleteTask} />
                    </Button>
                )}
            </footer>
        </motion.li>
    );
};

export default Task;
