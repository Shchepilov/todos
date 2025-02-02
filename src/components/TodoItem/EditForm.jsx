import { useState } from "react";
import styles from "./EditForm.module.scss";
import dayjs from "dayjs";
import { useStore } from "../../store/store";

const EditForm = ({ id, content, priority, date, handleUpdate, handleCancel, dueDate }) => {
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const [newDueDate, setNewDueDate] = useState(dueDate || currentDate);
    const [isDueDate, setIsDueDate] = useState(!!dueDate);
    const [newContent, setNewContent] = useState(content);
    const [newPriority, setNewPriority] = useState(priority);
    const [newDate, setNewDate] = useState(date);

    //console.log(isDueDate);

    const handleUpdateTodo = (e) => {
        e.preventDefault();

        if (!newContent) return;

        const updatedDueDate = isDueDate ? newDueDate : null;

        handleUpdate(id, newContent, newPriority, newDate, updatedDueDate);
    };

    return (
        <form className={styles.EditForm} onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Add a new todo"
            />
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <div className={styles.formRow}>
                <input type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
                <label>du date</label>

                {isDueDate && <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />}
            </div>

            <div className={styles.actions}>
                <button onClick={handleUpdateTodo}>Update</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default EditForm;
