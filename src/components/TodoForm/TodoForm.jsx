import { useState, useRef } from "react";
import { useStore } from "../../store/store";
import styles from "./TodoForm.module.scss";

const TodoForm = () => {
    const [dueDate, setDueDate] = useState();
    const [isDueDate, setIsDueDate] = useState(false);
    const addTodo = useStore((state) => state.addTodo);
    const contentRef = useRef();
    const priorityRef = useRef();
    const dueDateRef = useRef();

    const handleAddTodo = () => {
        const content = contentRef.current.value;
        const priority = priorityRef.current.value;
        const dueDate = dueDateRef.current.value;

        if (!content) return;

        addTodo(content, priority, dueDate);
        contentRef.current.value = "";
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            <div className={styles.formRow}>
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
            </div>

            <button onClick={handleAddTodo}>Add</button>

            <div className={styles.formRow}>
                <input type="checkbox" onChange={(e) => setIsDueDate(e.target.checked)} />
                <label>du date</label>

                {isDueDate && <input type="date" ref={dueDateRef} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />}
            </div>
        </form>
    );
};

export default TodoForm;
