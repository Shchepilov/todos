import { useRef } from "react";
import { useStore } from "@store/store";
import styles from './ColumnForm.module.scss';

const ColumnForm = ({ boardId }) => {
    const addColumn = useStore((state) => state.addColumn);
    const columnRef = useRef();

    const handleAddColumn = () => {
        const name = columnRef.current.value;

        if (!name) return;

        addColumn(boardId, name);
        columnRef.current.value = "";
    }

    return ( 
        <>
            <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                <input  type="text"  ref={columnRef}  placeholder="New Column"/>
                <button onClick={handleAddColumn}>Create Column</button>
            </form>
        </> 
    );
}
 
export default ColumnForm;