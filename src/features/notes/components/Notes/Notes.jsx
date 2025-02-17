import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import styles from "./Notes.module.scss";

const Notes = () => {
    return (
        <div className={styles.layout}>
            <NoteForm />
            <NoteList />
        </div>
    );
};

export default Notes;
