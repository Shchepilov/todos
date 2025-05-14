import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import styles from './Task.module.scss';
import { motion } from "framer-motion";

const Task = ({ task }) => {
    const deleteTask = useStore((state) => state.deleteTask);
    const updateTask = useStore((state) => state.updateTask);
    const columns = useStore((state) => state.columns[task.boardId]);
    const navigate = useNavigate();

    const handleChangeColumn = (e) => updateTask(task.boardId, task.id, { columnId: e.target.value });
    const handleChangePriority = (e) => updateTask(task.boardId, task.id, { priority: e.target.value });

    const handleDeleteTask = () => {
        deleteTask(task.id, task.boardId);
    };

    const handleTaskDetails = () => {
        navigate(`/boards/${task.boardId}/tasks/${task.id}`);
    };

    return (
        <motion.li
            layout
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={styles.item} 
            data-priority={task.priority}>
                
                
            <p className={styles.title} onClick={handleTaskDetails}>{task.title}</p>
            
            <div className={styles.fieldWrapper}>
                <div className={styles.field}>
                    <label htmlFor="column" className="label">Move to</label>
                    <select id="column" className={styles.select} value={task.columnId} onChange={handleChangeColumn}>
                        {columns.map(column => (
                            <option key={column.id} value={column.id}>{column.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="priority" className="label">Priority</label>

                    <select id="priority" value={task.priority} onChange={handleChangePriority} className={styles.select}>
                        <option value="1">Backlog</option>
                        <option value="2">Trivial</option>
                        <option value="3">Minor</option>
                        <option value="4">Major</option>
                        <option value="5">Critical</option>
                        <option value="6">Blocker</option>
                    </select>
                </div>
            </div>

                            

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
