import { useStore } from "@store/store";
import Column from '../Column/Column';
import styles from './Columns.module.scss';

const Columns = ({boardId}) => {
    const columns = useStore((state) => state.columns[boardId]);

    return (
        <div className={styles.columns}>
            {columns && columns.map((column) => (
                <Column key={column.id} column={column} boardId={boardId} />
            ))}
        </div>
     );
}
 
export default Columns;
