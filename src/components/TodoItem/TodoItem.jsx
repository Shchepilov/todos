import { useState } from "react";
import { useStore } from "../../store/store";
import Modal from "../Modal/Modal";
import EditForm from "./EditForm";
import Loader from "../Loader/Loader";
import styles from "./TodoItem.module.scss";
import dayjs from "dayjs";

const TodoItem = ({ todo }) => {
    const [isEditing, setIsEditing] = useState(false);
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

    const handleCancel = () => setIsEditing(false);
    const handleUpdate = (id, content, priority, date, dueDate) => {
        update(id, { content, priority, date, dueDate: dueDate });
        setIsEditing(false);
    };

    const handleStatusChange = () => {
        update(todo.id, { done: !todo.done });
    };

    const handleEdit = () => {
        setIsEditing(true);
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
                {isEditing && (
                    <Modal heading="Edit Todo" onClose={handleCancel}>
                        <EditForm
                            content={todo.content}
                            priority={todo.priority}
                            id={todo.id}
                            date={todo.date}
                            dueDate={todo.dueDate}
                            handleUpdate={handleUpdate}
                            handleCancel={handleCancel}
                        />
                    </Modal>
                )}

                {todo.dueDate && (
                    dayjs(todo.dueDate).isBefore(dayjs(day)) ? (
                        <p className={styles.red}>OVERDUE!</p>
                    ) : todo.dueDate === day ? (
                        <p className={styles.red}>Today is due date. FINISH HIM!</p>
                    ) : null
                )}
            </div>
            <div className={styles.Actions}>
                <button onClick={() => deleteTodo(todo.id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                </button>
                <button onClick={() => moveToNextDay(todo.id)} title="Move to next day">
                    <span className="material-symbols-outlined">event_upcoming</span>
                </button>
                <button onClick={handleEdit} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                </button>
            </div>
        </li>
    );
};

export default TodoItem;
