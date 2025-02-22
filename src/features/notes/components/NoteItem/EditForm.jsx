import { useState, useRef } from "react";
import { Dialog } from "radix-ui";
import styles from "../NoteItem/NoteItem.module.scss";

const EditForm = ({ id, content, handleUpdate}) => {
    const [newContent, setNewContent] = useState(content);
    const closeDialogRef = useRef(null);

    const handleUpdateNote = () => {
        if (!newContent) return;

        handleUpdate(id, newContent);

        closeDialogRef.current?.click();
    };

    return (
        <form className={styles.editForm} onSubmit={(e) => e.preventDefault()}>
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            <div className={styles.actions}>
                <button type="submit" onClick={handleUpdateNote}>Update</button>

                <Dialog.Close ref={closeDialogRef} asChild>
                    <button>Cancel</button>
                </Dialog.Close>
            </div>
        </form>
    );
};

export default EditForm;
