import { useEffect } from "react";
import { useStore } from "../../store/store";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

const TodoList = () => {
    const user = useStore((state) => state.user);
    const todos = useStore((state) => state.todos);
    const fetchTodos = useStore((state) => state.fetchTodos);
    const currentDay = useStore((state) => state.currentDay);
    const isLoading = useStore((state) => state.isLoading);

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const sortedTodos = todos.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    useEffect(() => {
        fetchTodos();
    }, [user, currentDay]);

    return (
        <div className={styles.TodoListContainer}>
            {isLoading && <div className={styles.loader}></div>}
            {todos.length === 0 && <p>No todos for this day</p>}
            {todos.length > 0 && <ul className={styles.TodoList}>
                {sortedTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>}
        </div>
    );
};

export default TodoList;
