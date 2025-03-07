import { useState, memo } from "react";
import { useStore } from "@store/store";
import { TrashIcon, CalendarIcon, DotsVerticalIcon, Pencil1Icon, ReloadIcon, ClockIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import EditForm from "./EditForm";
import Loader from "@components/Loader/Loader";
import Modal from "@components/Modal/Modal";
import styles from "./TodoItem.module.scss";
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import Checkbox from "@components/Checkbox/Checkbox";
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

    const handleUpdate = async (id, content, priority, date, dueDate, autoMove) => {
        setIsLoading(true);
        try {
            await updateTodo(id, { content, priority, date, dueDate: dueDate, autoMove });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async () => {
        setIsLoading(true);
        try {
            await updateTodo(todo.id, { done: !todo.done });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTodo = async () => {
        setIsLoading(true);
        try {
            await deleteTodo(todo.id);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoveToNextDay = async () => {
        setIsLoading(true);
        try {
            await moveToNextDay(todo.id);
        } finally {
            setIsLoading(false);
        }
    };

    const isOverdue = dayjs(todo.dueDate).isBefore(dayjs(day));
    const isToday = todo.dueDate === day;
    const badgeClass = isOverdue || isToday ? styles.isToday + " " + styles.badge : styles.badge;
    const timestampFormatted = dayjs(new Date(todo.timestamp.seconds * 1000)).format("MMM D, YYYY");
    const dueDateFormatted = dayjs(todo.dueDate).format("MMM D");
    const classes = isLoading ? styles.item + " " + styles.loading : styles.item;

    return (
        <motion.li
            key={todo.id}
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            data-priority={todo.priority}
            className={classes}
        >
            
            <Checkbox checked={todo.done} onChange={handleStatusChange} />

            {/* <input type="checkbox" checked={todo.done} onChange={handleStatusChange} /> */}

            <div className={styles.Content}>
                <p className={todo.done ? styles.Done : null}>{todo.content}</p>

                <div className={styles.badges}>
                    {todo.dueDate && (
                        <span className={badgeClass}>
                            {isOverdue ? (
                                    <>
                                        <ClockIcon className={styles.icon} />
                                        <span>{dueDateFormatted} - Overdue</span>
                                    </>
                                ) : (
                                    <>
                                        <CalendarIcon />
                                        <span>{dueDateFormatted}</span>
                                    </>
                                )}
                        </span>
                    )}
                    {todo.autoMove && (
                        <span className={styles.badge}>
                            <ReloadIcon className={styles.icon} />
                            <span>Automove</span>
                        </span>
                    )}
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

                        <DropdownMenu.Item className={dropdown.item} onSelect={handleMoveToNextDay}>
                            <CalendarIcon /> Move to next day
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={handleDeleteTodo}>
                            <TrashIcon /> Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Modal heading='Edit Todo' isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}>
                <EditForm
                    content={todo.content}
                    priority={todo.priority}
                    id={todo.id}
                    date={todo.date}
                    dueDate={todo.dueDate}
                    autoMove={todo.autoMove}
                    handleUpdate={handleUpdate}
                />
            </Modal>
        </motion.li>
    );
};

export default memo(TodoItem);
