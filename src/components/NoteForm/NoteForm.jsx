import { useRef } from "react";
import { useStore } from "../../store/store";
import styles from "../NoteForm/NoteForm.module.scss";

const NoteForm = () => {
    const addNote = useStore((state) => state.addNote);
    const contentRef = useRef();

    const handleAddNote = () => {
        const content = contentRef.current.value;

        if (!content) return;

        addNote(content);
        contentRef.current.value = "";
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
            <textarea type="text" ref={contentRef} placeholder="Add a new note" />
            <button onClick={handleAddNote}>Add Note</button>
        </form>
    );
};

export default NoteForm;
