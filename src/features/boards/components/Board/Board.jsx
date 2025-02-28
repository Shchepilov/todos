import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from "@store/store";
import ColumnForm from '../ColumnForm/ColumnForm';
import Columns from '../Columns/Columns';
import styles from './Board.module.scss';

const Board = () => {
    const boards = useStore((state) => state.boards);
    const deleteBoard = useStore((state) => state.deleteBoard);
    const { boardId } = useParams();
    const navigate = useNavigate();

    const board = boards.find(board => board.id === boardId);

    useEffect(() => {
        if (!board) {
            navigate('/boards', { replace: true });
        }
    }, [board]);

    if (!board) return;

    const handleDeleteBoard = async () => {
        await deleteBoard(boardId);
    };

    return ( 
        <div className={styles.board}>
            <h2 className={styles.title}>
                {board.name}
                <button onClick={handleDeleteBoard}>x</button>
            </h2>

            <ColumnForm boardId={boardId} />

            <Columns boardId={boardId} />
        </div>
     );
}
 
export default Board;