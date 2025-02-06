import { useState, memo } from "react";
import { useStore } from "../../store/store"
import { TrashIcon } from "@radix-ui/react-icons";
import Loader from "../Loader/Loader";
import EditNote from "./EditForm";
import styles from "./NoteItem.module.scss";
import todoItemStyles from "../TodoItem/TodoItem.module.scss";

const NoteItem = ({ note }) => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteNote = useStore((state) => state.deleteNote);
    const updateNote = useStore((state) => state.updateNote);

    const update = async (id, data) => {
        setIsLoading(true);
        await updateNote(id, data);
        setIsLoading(false);
    };
    
    const handleUpdate = (id, content) => {
        update(id, { content });
        
    };

    return (
        <li className={styles.item + " " + todoItemStyles.TodoItem}>
            {isLoading && <Loader className={styles.loader} />}

            <p>{note.content}</p>

            <div className={todoItemStyles.Actions}>
                <button onClick={() => deleteNote(note.id)}>
                    <TrashIcon />
                </button>
                <EditNote
                    content={note.content}
                    id={note.id}
                    handleUpdate={handleUpdate}
                />
            </div>
        </li>
    );
};

export default memo(NoteItem);
