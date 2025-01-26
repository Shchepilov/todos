import { useState } from "react";
import styles from "../NoteItem/NoteItem.module.scss";

const EditForm = ({ id, content, handleUpdate, handleCancel }) => {
    const [newContent, setNewContent] = useState(content);

    const handleUpdateNote = () => {
        if (!newContent) return;

        handleUpdate(id, newContent);
    };

    return (
        <form className={styles.editForm} onSubmit={(e) => e.preventDefault()}>
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            <div className={styles.actions}>
                <button onClick={handleUpdateNote}>Update</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default EditForm;
