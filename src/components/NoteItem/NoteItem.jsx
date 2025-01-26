import { useState } from "react";
import { useStore } from "../../store/store";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import EditForm from "./EditForm";
import styles from "./NoteItem.module.scss";
import todoItemStyles from "../TodoItem/TodoItem.module.scss";

const NoteItem = ({ note }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const deleteNote = useStore((state) => state.deleteNote);
    const updateNote = useStore((state) => state.updateNote);

    const update = async (id, data) => {
        setIsLoading(true);
        await updateNote(id, data);
        setIsLoading(false);
    };

    const handleCancel = () => setIsEditing(false);
    const handleUpdate = (id, content) => {
        update(id, { content });
        setIsEditing(false);
    };
    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <li className={styles.item + " " + todoItemStyles.TodoItem}>
            {isLoading && <Loader className={styles.loader} />}

            <p>{note.content}</p>

            <div className={todoItemStyles.Actions}>
                <button onClick={() => deleteNote(note.id)}>
                    <span className="material-symbols-outlined">delete</span>
                </button>
                <button onClick={handleEdit}>
                    <span className="material-symbols-outlined">edit</span>
                </button>
            </div>

            {isEditing && (
                <Modal heading="Edit Note" onClose={handleCancel}>
                    <EditForm
                        content={note.content}
                        id={note.id}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                    />
                </Modal>
                )}
        </li>
    );
};

export default NoteItem;
