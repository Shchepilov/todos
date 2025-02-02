import { useState } from "react";
import styles from "./EditForm.module.scss";
import forms from "../../Forms.module.scss";
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

    const handleUpdateTodo = (e) => {
        e.preventDefault();

        if (!newContent) return;

        const updatedDueDate = isDueDate ? newDueDate : null;

        handleUpdate(id, newContent, newPriority, newDate, updatedDueDate);
    };

    return (
        <form className={forms.form} onSubmit={(e) => e.preventDefault()}>
            <div className={forms.formLabel}>
                <label>Title</label>
            </div>

            <div className={forms.formField}>
                <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Add a new todo"
                />
            </div>

            <div className={forms.formLabel}>
                <label>Priority</label>
            </div>

            <div className={forms.formField}>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className={forms.formLabel}>
                <label>Date</label>
            </div>

            <div className={forms.formField}>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>

            <div className={forms.formLabel}>
                <label>Due date</label>
            </div>
            
            <div className={forms.formField}>
                <input type="date" disabled={!isDueDate} value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                <input type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
            </div>

            <div className={styles.actions}>
                <button onClick={handleUpdateTodo}>Update</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default EditForm;
