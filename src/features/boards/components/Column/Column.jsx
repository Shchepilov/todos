import { useStore } from "@store/store";
import TaskForm from "../TaskForm/TaskForm";
import Tasks from "../Tasks/Tasks";
import styles from './Column.module.scss';

const Column = ({ column, boardId }) => {
    const deleteColumn = useStore((state) => state.deleteColumn);

    return ( 
        <div className={styles.column}>
            <div className={styles.header}>
                <h3>{column.name}</h3>
                <button onClick={() => deleteColumn(column.id, boardId)}>x</button>
            </div>

            <TaskForm columnId={column.id} boardId={boardId} />
            <Tasks columnId={column.id} boardId={boardId} />
        </div>
     );
}
 
export default Column;
