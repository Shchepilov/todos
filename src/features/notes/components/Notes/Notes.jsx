import NoteList from "../NoteList/NoteList";
import styles from "./Notes.module.scss";

const Notes = () => {
    return (
        <div className={styles.layout}>
            <NoteList />
        </div>
    );
};

export default Notes;
