import { useState } from 'react';
import { useStore } from "@store/store";
import { TrashIcon, PlusIcon, GearIcon, Pencil1Icon, ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import Modal from "@components/Modal/Modal";
import Button from '@components/Button/Button';
import { deleteColumn, updateColumn } from '@features/boards/services/columnsQuery';
import { updateTask } from '@features/boards/services/tasksQuery';
import TaskForm from "./TaskForm";
import Tasks from "../Tasks/Tasks";
import styles from './Column.module.scss';
import ColumnSettings from './ColumnSettings';

const Column = ({ column, boardId }) => {
    const setDroppedColumnId = useStore((state) => state.setDroppedColumnId);
    const [taskFormModal, setTaskFormModal] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [columnSettingsModal, setColumnSettingsModal] = useState(false);
    const boards = useStore((state) => state.boards);
    const columns = useStore((state) => state.columns);

    const showTaskForm = () => setTaskFormModal(true);
    const handleDeleteColumn = () => deleteColumn(column.id);
    const showColumnSettings = () => setColumnSettingsModal(true);

    const isLastColumn = columns.findIndex(col => col.id === column.id) === columns.length - 1;
    const isFirstColumn = columns.findIndex(col => col.id === column.id) === 0;

    const handleMoveColumnRight = () => {
        const columnIndex = columns.findIndex(col => col.id === column.id);
        const nextColumnId = columns[columnIndex + 1]?.id;

        updateColumn(column.id, { order: columnIndex + 1 });
        updateColumn(nextColumnId, { order: columnIndex });
    }

    const handleMoveColumnLeft = () => {
        const columnIndex = columns.findIndex(col => col.id === column.id);
        const prevColumnId = columns[columnIndex - 1]?.id;

        updateColumn(column.id, { order: columnIndex - 1 });
        updateColumn(prevColumnId, { order: columnIndex });
    }

    const isWatcher = boards.find(board => board.id === boardId).isWatcher || false;

    const handleDragOver = (e) => {
        e.preventDefault();

        if (!isDragOver) setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();

        setIsDragOver(false);
    };

    const handleDrop = async(e) => {
        e.preventDefault();
        setIsDragOver(false);
        setDroppedColumnId(column.id);
        
        const dragTaskId = e.dataTransfer.getData("taskId");
        const dragColumnId = e.dataTransfer.getData("columnId");

        if (dragColumnId !== column.id) {
            setIsLoading(true);
            
            try {
                await updateTask(dragTaskId, { columnId: column.id });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return ( 
        <motion.div 
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className={`${styles.column} ${isDragOver ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>

            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>{column.name}</h3>
                    
                    {!isWatcher && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <Button variation="transparent">
                                    <GearIcon className={isLoading ? styles.loading : ''} />
                                </Button>
                            </DropdownMenu.Trigger>
            
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                                    <DropdownMenu.Item className={dropdown.item} onSelect={showColumnSettings}>
                                        <Pencil1Icon /> Edit
                                    </DropdownMenu.Item>

                                    {!isFirstColumn && (
                                        <DropdownMenu.Item className={dropdown.item} onSelect={handleMoveColumnLeft}>
                                            <ArrowLeftIcon /> Move Left
                                        </DropdownMenu.Item>
                                    )}

                                    {!isLastColumn && (
                                        <DropdownMenu.Item className={dropdown.item} onSelect={handleMoveColumnRight}>
                                            Move Right <ArrowRightIcon />
                                        </DropdownMenu.Item>
                                    )}
                                    
                                    <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={handleDeleteColumn}>
                                        <TrashIcon /> Delete Column
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    )}
                </div>
                
                <Button variation="icon" size="small" className={styles.addTaskButton} onClick={showTaskForm}>
                    <PlusIcon width={16} height={16}/>
                </Button>
            </div>

            <Modal heading='+ Add Task' isDialogOpen={taskFormModal} setIsDialogOpen={setTaskFormModal}>
                <TaskForm columnId={column.id} boardId={boardId} />
            </Modal>

            <Modal heading='Column Settings' isDialogOpen={columnSettingsModal} setIsDialogOpen={setColumnSettingsModal}>
                <ColumnSettings column={column} />
            </Modal>

            <Tasks columnId={column.id} />
        </motion.div>
     );
}
 
export default Column;
