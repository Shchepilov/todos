import { useStore } from "@store/store";
import Column from '../Column/Column';
import styles from './Columns.module.scss';
import { useEffect } from 'react';

const Columns = ({boardId}) => {
    const columns = useStore((state) => state.columns[boardId]);
    const fetchBoardData = useStore((state) => state.fetchBoardData);

    useEffect(() => {
        fetchBoardData(boardId);
    }, []);

    return ( 
        <>
            <div className={styles.columns}>
                {columns && columns.map((column) => (
                    <Column key={column.id} column={column} boardId={boardId} />
                ))}
            </div>
        </>
     );
}
 
export default Columns;