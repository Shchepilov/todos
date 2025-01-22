import { useRef } from "react";
import { useStore } from "../../store/store";
import styles from "./TodoForm.module.scss";

const TodoForm = () => {
    const addTodo = useStore((state) => state.addTodo);
    const contentRef = useRef();
    const priorityRef = useRef();

    const handleAddTodo = () => {
        const content = contentRef.current.value;
        const priority = priorityRef.current.value;

        if (!content) return;

        addTodo(content, priority);
        contentRef.current.value = "";
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            <input
                type="text"
                ref={contentRef}
                placeholder="Add a new todo"
            />
            <select ref={priorityRef}>
            <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={handleAddTodo}>Add</button>
        </form>
    );
};

export default TodoForm;
