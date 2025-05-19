import { useStore } from "@store/store";
import Column from '../Column/Column';
import styles from './Columns.module.scss';

const Columns = ({boardId}) => {
    const columns = useStore((state) => state.columns);

    return (
        <div className={styles.columnsWrapper}>
            <div className={styles.columns}>
                {columns && columns.map((column) => (
                    <Column key={column.id} column={column} boardId={boardId} />
                ))}
            </div>
        </div>
     );
}
 
export default Columns;
