import { useState } from 'react';
import { useStore } from "@store/store";
import { TrashIcon, PlusIcon, GearIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import Modal from "@components/Modal/Modal";
import Button from '@components/Button/Button';
import TaskForm from "./TaskForm";
import Tasks from "../Tasks/Tasks";
import styles from './Column.module.scss';

const Column = ({ column, boardId }) => {
    const deleteColumn = useStore((state) => state.deleteColumn);
    const [taskFormModal, setTaskFormModal] = useState(false);

    const showTaskForm = () => setTaskFormModal(true);
    const handleDeleteColumn = () => deleteColumn(column.id, boardId);

    return ( 
        <motion.div 
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className={styles.column}>

            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>{column.name}</h3>
                    
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button variation="transparent">
                                <GearIcon width={18} height={18} />
                            </Button>
                        </DropdownMenu.Trigger>
        
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                                <DropdownMenu.Item className={dropdown.item} onSelect={() => console.log('Edit')}>
                                    <Pencil1Icon /> Edit
                                </DropdownMenu.Item>
                                
                                <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={handleDeleteColumn}>
                                    <TrashIcon /> Delete Column
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
                
                <Button variation="icon" size="small" className={styles.addTaskButton} onClick={showTaskForm}>
                    <PlusIcon width={16} height={16}/>
                </Button>
            </div>

            <Modal heading='+ Add Task' isDialogOpen={taskFormModal} setIsDialogOpen={setTaskFormModal}>
                <TaskForm columnId={column.id} boardId={boardId} />
            </Modal>

            <Tasks columnId={column.id} boardId={boardId} />
        </motion.div>
     );
}
 
export default Column;
