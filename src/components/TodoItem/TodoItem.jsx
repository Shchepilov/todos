import { useState, memo } from "react";
import { useStore } from "../../store/store";
import { TrashIcon, CalendarIcon } from "@radix-ui/react-icons";
import EditForm from "./EditForm";
import Loader from "../Loader/Loader";
import styles from "./TodoItem.module.scss";
import dayjs from "dayjs";

const TodoItem = ({ todo }) => {
    const [isLoading, setIsLoading] = useState(false);
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

    return (
        <li key={todo.id} className={styles.TodoItem}>
            {isLoading && <Loader className={styles.loader} />}
            <input type="checkbox" checked={todo.done} onChange={handleStatusChange} />
            <div className={styles.Content}>
                <p className={todo.done ? styles.Done : null}>{todo.content}</p>
                <p>priority: {todo.priority}</p>
                <p>Date: {todo.date}</p>
                {todo.dueDate && <p>Due date: {todo.dueDate}</p>}
                <p>Status: {todo.done ? "done" : "in progress"}</p>
                <p>Created at: {todo.createdAt}</p>
                {todo.autoMove && <p>autoMove: yes</p>}
                {todo.dueDate &&
                    (dayjs(todo.dueDate).isBefore(dayjs(day)) ? (
                        <p className={styles.red}>OVERDUE!</p>
                    ) : todo.dueDate === day ? (
                        <p className={styles.red}>Today is due date. FINISH HIM!</p>
                    ) : null)}
            </div>
            <div className={styles.Actions}>
                <button onClick={() => deleteTodo(todo.id)} title="Delete">
                    <TrashIcon />
                </button>
                <button onClick={() => moveToNextDay(todo.id)} title="Move to next day">
                    <CalendarIcon />
                </button>

                <EditForm
                    content={todo.content}
                    priority={todo.priority}
                    id={todo.id}
                    date={todo.date}
                    dueDate={todo.dueDate}
                    autoMove={todo.autoMove}
                    handleUpdate={handleUpdate}
                />
            </div>
        </li>
    );
};

export default memo(TodoItem);
