import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import { DotsVerticalIcon, DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import styles from './Task.module.scss';
import { motion } from "framer-motion";
import { TASK_STATUS } from "@features/boards/utils/constants";

import { deleteTask, updateTask } from '@features/boards/services/tasksQuery';

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

    return (
        <motion.li
            ref={taskRef}
            layout
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={styles.item} 
            data-priority={task.priority}>
                
                <header className={styles.header}>
                    <span role="button" className={styles.title} onClick={handleTaskDetails}>{task.title}</span>

                    <div draggable="true"
                         onDragStart={handleDragStart}
                         onDragEnd={handleDragEnd}
                         className={styles.dragHandle}>

                        <DragHandleDots2Icon width={20} height={20} />
                    </div>
                </header>
            
            <div className={styles.fieldWrapper}>
                <select id="column" className={styles.select} value={task.columnId} onChange={handleChangeColumn}>
                    {columns.map(column => (
                        <option key={column.id} value={column.id}>{column.name}</option>
                    ))}
                </select>

                <select id="priority" value={task.priority} onChange={handleChangePriority} className={styles.select}>
                    {TASK_STATUS.map((status, index) => (
                        <option key={index} value={status.value}>{status.name}</option>
                    ))}
                </select>
            </div>

            {!isWatcher && (
                <Button variation="transparent" className={styles.deleteButton} size="small" aria-label="Delete task">
                    <TrashIcon onClick={handleDeleteTask} />
                </Button>
            )}

            {/* <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Button variation="transparent" size="small">
                        <DotsVerticalIcon width={16} height={16} />
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                        <DropdownMenu.Item className={dropdown.item} onSelect={() => console.log('Edit')}>Edit</DropdownMenu.Item>
                        <DropdownMenu.Item className={`${dropdown.item} ${dropdown.itemDanger}`} onSelect={handleDeleteTask}>Delete</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root> */}
        </motion.li>
    );
};

export default Task;
