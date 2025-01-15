import { useState } from "react";
import styles from "./EditForm.module.scss";

const EditForm = ({ id, content, priority, date, handleUpdate, handleCancel }) => {
    const [newContent, setNewContent] = useState(content);
    const [newPriority, setNewPriority] = useState(priority);
    const [newDate, setNewDate] = useState(date);

    const handleUpdateTodo = () => {
        if (!newContent) return;

        handleUpdate(id, newContent, newPriority, newDate);
    };

    return (
        <div className={styles.EditForm}>
            <p>Edit Form</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Add a new todo"
                />
                <input 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                />
                <select value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button onClick={handleUpdateTodo}>Update</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditForm;
