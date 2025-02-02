import { useState, useRef } from "react";
import { useStore } from "../../store/store";
import styles from "./TodoForm.module.scss";
import forms from "../../Forms.module.scss";
import dayjs from "dayjs";

const TodoForm = () => {
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const addTodo = useStore((state) => state.addTodo);
    const contentRef = useRef();
    const priorityRef = useRef();
    const dueDateRef = useRef();
    const [dueDate, setDueDate] = useState(currentDate);
    const [isDueDate, setIsDueDate] = useState(false);

    const handleAddTodo = (e) => {
        e.preventDefault();

        const content = contentRef.current.value;
        const priority = priorityRef.current.value;
        const dueDate = dueDateRef.current.value;

        if (!content) return;
        
        const updatedDueDate = isDueDate ? dueDate : null;

        addTodo(content, priority, updatedDueDate);
        contentRef.current.value = "";
        setDueDate(currentDate);
        setIsDueDate(false);
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form + " " + forms.form}>
            <div className={forms.formLabel}>
                <label>Title</label>
            </div>

            <div className={forms.formField}>
                <input type="text" ref={contentRef} placeholder="Add a new todo"/>
            </div>

            <div className={forms.formLabel}>
                <label>Priority</label>
            </div>

            <div className={forms.formField}>
                <select ref={priorityRef}>
                    <option value="" disabled>Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className={forms.formLabel}>
                <label>Due date</label>
            </div>
            
            <div className={forms.formField}>
                <input type="date" disabled={!isDueDate} ref={dueDateRef} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <input type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
            </div>

            <div className={forms.emptyLabel}>
                <button className={forms.button} onClick={handleAddTodo}>Add</button>
            </div>
        </form>
    );
};

export default TodoForm;
