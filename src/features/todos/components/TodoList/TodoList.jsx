import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@store/store";
import TodoForm from "../TodoForm/TodoForm";
import TodoItem from "../TodoItem/TodoItem";
import Loader from "@components/Loader/Loader";
import Modal from "@components/Modal/Modal";
import Button from "@components/Button/Button";
import useTodos from "@features/todos/hooks/useTodos";
import styles from "./TodoList.module.scss";

const TodoList = () => {
    const { loading, error } = useTodos();
    const todos = useStore((state) => state.todos);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className={styles.TodoListContainer}>
            {loading && <Loader className={styles.loader} />}
            
            {todos.length > 0 && (
                <>
                    <Button variation="icon" size="small" className={styles.addButtonSmall} onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                    </Button>

                    <ul className={styles.TodoList}>
                        <AnimatePresence>
                            {todos.map((todo) => (
                                <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </AnimatePresence>
                    </ul>
                </>
            )}

            {todos.length === 0 && (
                <div className={styles.noTodos}>
                    <Button variation="icon" size="large" className={styles.addButton} onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                    </Button>
                    <p>Add new todo</p>
                </div>
            )}

            <Modal heading='+ New Todo' isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}>
                <TodoForm />
            </Modal>
        </div>
    );
};

export default TodoList;
