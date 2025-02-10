import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Loader from "../Loader/Loader";
import NoteItem from "../NoteItem/NoteItem";
import styles from "./NoteList.module.scss";
import TodoListStyles from "../TodoList/TodoList.module.scss";
import { AnimatePresence } from "framer-motion";

const NoteList = () => {
    const notes = useStore((state) => state.allNotes);
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
        </div>
    );
};

export default NoteList;
