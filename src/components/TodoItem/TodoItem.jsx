import { useState } from 'react';
import { useStore } from '../../store/store';
import EditForm from './EditForm';
import styles from './TodoItem.module.css';

const TodoItem = ({todo}) => {
    const [isEditing, setIsEditing] = useState(false);
    const deleteTodo = useStore((state) => state.deleteTodo);
    const updateTodo = useStore((state) => state.updateTodo);
    const moveToNextDay = useStore((state) => state.moveToNextDay);

    const handleCancel = () => setIsEditing(false);
    const handleUpdate = (id, content, priority, date) => {
        updateTodo(id, { content, priority, date });
        setIsEditing(false);
    };

    return ( 
        <li key={todo.id} className={styles.TodoItem}>
            <div className={styles.Content}>
                <p>{todo.content}</p>
                <p>priority: {todo.priority}</p>
                <p>Date: {todo.date}</p>
                <p>Status: {todo.done ? 'done': 'in progress'}</p>
            </div>
            <div className={styles.Actions}>
                <button onClick={() => updateTodo(todo.id, { done: !todo.done })}>
                    {todo.done ? 'done': 'in progress'}
                </button>
                <button onClick={() => moveToNextDay(todo.id)}>Move to next day</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                {isEditing ? (
                    <EditForm
                        content={todo.content}
                        priority={todo.priority}
                        id={todo.id}
                        date={todo.date}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                    />
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </div>
        </li>
     );
}
 
export default TodoItem;
