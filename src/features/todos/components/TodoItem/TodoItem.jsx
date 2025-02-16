import { useState, memo } from "react";
import { useStore } from "../../../../store/store";
import { TrashIcon, CalendarIcon, DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import EditForm from "./EditForm";
import Loader from "../../../../components/Loader/Loader";
import styles from "./TodoItem.module.scss";
import dropdown from '../../../../styles/Dropdown.module.scss';
import dayjs from "dayjs";
import { motion } from "framer-motion";

const TodoItem = ({ todo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const deleteTodo = useStore((state) => state.deleteTodo);
    const updateTodo = useStore((state) => state.updateTodo);
    const moveToNextDay = useStore((state) => state.moveToNextDay);
    const currentDay = useStore((state) => state.currentDay);
    const day = dayjs(currentDay).format("YYYY-MM-DD");

    const update = async (id, data) => {
        setIsLoading(true);
        await updateTodo(id, data);
        setIsLoading(false);
    };

    const handleUpdate = (id, content, priority, date, dueDate, autoMove) => {
        update(id, { content, priority, date, dueDate: dueDate, autoMove });
    };

    const handleStatusChange = () => {
        update(todo.id, { done: !todo.done });
    };

    const isOverdue = dayjs(todo.dueDate).isBefore(dayjs(day));
    const isToday = todo.dueDate === day;
    const badgeClass = isOverdue || isToday ? styles.isToday + " " + styles.badge : styles.badge;
    const timestampFormatted = dayjs(new Date(todo.timestamp.seconds * 1000)).format("MMM D, YYYY");
    const dueDateFormatted = dayjs(todo.dueDate).format("MMM D");

    return (
        <motion.li
            key={todo.id}
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            data-priority={todo.priority}
            className={styles.TodoItem}
        >
            {isLoading && <Loader className={styles.loader} />}

            <input type="checkbox" checked={todo.done} onChange={handleStatusChange} />

            <div className={styles.Content}>
                <p className={todo.done ? styles.Done : null}>{todo.content}</p>

                <div className={styles.badges}>
                    {todo.dueDate && (
                        <span className={badgeClass}>
                            Due date: {dueDateFormatted} {isOverdue && '- OVERDUE'}
                        </span>
                    )}
                    {todo.autoMove && !todo.done && <span className={styles.badge} >Auto move to next day</span>}
                </div>
            </div>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className={styles.dropdownButton}>
                        <DotsVerticalIcon />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className={dropdown.content} align="end">
                        <DropdownMenu.Item className={dropdown.item} disabled>
                            Created at: {timestampFormatted}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className={dropdown.separator} />

                        <DropdownMenu.Item className={dropdown.item} onSelect={() => setIsDialogOpen(true)}>
                            <Pencil1Icon /> Edit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={dropdown.item} onSelect={() => moveToNextDay(todo.id)}>
                            <CalendarIcon /> Move to next day
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={() => deleteTodo(todo.id)}>
                            <TrashIcon /> Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <EditForm
                content={todo.content}
                priority={todo.priority}
                id={todo.id}
                date={todo.date}
                dueDate={todo.dueDate}
                autoMove={todo.autoMove}
                handleUpdate={handleUpdate}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
            />
        </motion.li>
    );
};

export default memo(TodoItem);
