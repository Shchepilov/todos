import { Cross2Icon } from "@radix-ui/react-icons";
import { useStore } from "@store/store";
import styles from './Column.module.scss';
import TaskForm from "../TaskForm/TaskForm";
import Tasks from "../Tasks/Tasks";

const Column = ({ column, boardId }) => {
    const removeColumn = useStore((state) => state.removeColumn);
    return ( 
        <>
            <div className={styles.column}>
                <div className={styles.header}>
                    <h3>{column.name}</h3>
                    <button onClick={() => removeColumn(column.id, boardId)}>
                        <Cross2Icon />
                    </button>
                </div>

                <TaskForm columnId={column.id} boardId={boardId} />
                <Tasks columnId={column.id} boardId={boardId} />
            </div>
        </>
     );
}
 
export default Column;