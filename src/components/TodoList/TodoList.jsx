import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Loader from "../Loader/Loader";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.scss";
import { AnimatePresence } from "framer-motion";

const TodoList = () => {
    const user = useStore((state) => state.user);
    const todos = useStore((state) => state.todos);
    const fetchTodos = useStore((state) => state.fetchTodos);
    const currentDay = useStore((state) => state.currentDay);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            await fetchTodos();
            setIsLoading(false);
        }
        fetch();
    }, [user, currentDay]);

    return (
        <div className={styles.TodoListContainer}>
            {isLoading && <Loader className={styles.loader} />}
            {todos.length === 0 && <p className={styles.noTodos}>No todos for this day</p>}
            {todos.length > 0 && <ul className={styles.TodoList}>
            <AnimatePresence>
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </AnimatePresence>
            </ul>}
        </div>
    );
};

export default TodoList;
