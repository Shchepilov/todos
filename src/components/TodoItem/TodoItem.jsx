import { useState } from "react";
import { useStore } from "../../store/store";
import Modal from "../Modal/Modal";
import EditForm from "./EditForm";
import Loader from "../Loader/Loader";
import styles from "./TodoItem.module.scss";

const TodoItem = ({ todo }) => {
    console.log('TodoItem rendered');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const deleteTodo = useStore((state) => state.deleteTodo);
    const updateTodo = useStore((state) => state.updateTodo);
    const moveToNextDay = useStore((state) => state.moveToNextDay);

    const update = async (id, data) => {
        setIsLoading(true);
        await updateTodo(id, data);
        setIsLoading(false);
    };

    const handleCancel = () => setIsEditing(false);
    const handleUpdate = (id, content, priority, date) => {
        update(id, { content, priority, date });
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
                <p>Status: {todo.done ? "done" : "in progress"}</p>
                <p>Created at: {todo.createdAt}</p>
                {isEditing && (
                    <Modal heading="Edit Todo" onClose={handleCancel}>
                        <EditForm
                            content={todo.content}
                            priority={todo.priority}
                            id={todo.id}
                            date={todo.date}
                            handleUpdate={handleUpdate}
                            handleCancel={handleCancel}
                        />
                    </Modal>
                )}
            </div>
            <div className={styles.Actions}>
                <button onClick={() => deleteTodo(todo.id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                </button>
                <button onClick={() => moveToNextDay(todo.id)} title="Move to next day">
                    <span className="material-symbols-outlined">tab_new_right</span>
                </button>
                <button onClick={handleEdit} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                </button>
            </div>
        </li>
    );
};

export default TodoItem;
