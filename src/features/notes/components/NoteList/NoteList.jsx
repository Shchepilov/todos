import { useEffect, useState } from "react";
import { useStore } from "@store/store";
import Loader from "@components/Loader/Loader";
import NoteItem from "../NoteItem/NoteItem";
import styles from "./NoteList.module.scss";
import TodoListStyles from "@features/todos/components/TodoList/TodoList.module.scss";
import { AnimatePresence } from "framer-motion";

const NoteList = () => {
    const notes = useStore((state) => state.allNotes);
    const addNote = useStore((state) => state.addNote);
    const fetchNotes = useStore((state) => state.fetchNotes);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            await fetchNotes();
            setIsLoading(false);
        };
        fetch();
    }, []);

    const handleAddNote = () => {
        const content = { edit: true };

        addNote(content);
    };

    return (
        <div className={styles.container}>
            {isLoading && <Loader className={styles.loader} />}
            {notes.length === 0 && <p className={TodoListStyles.noTodos}>No notes</p>}
            {notes.length > 0 && (
                <ul className={styles.list}>
                    <AnimatePresence>
                        {notes.map((note) => (
                            <NoteItem key={note.id} note={note} />
                        ))}
                    </AnimatePresence>
                </ul>
            )}

            <button onClick={handleAddNote}>Add Note</button>
        </div>
    );
};

export default NoteList;
