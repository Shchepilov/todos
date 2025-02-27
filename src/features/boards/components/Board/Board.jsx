import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from "@store/store";
import { Cross2Icon } from "@radix-ui/react-icons";
import ColumnForm from '../ColumnForm/ColumnForm';
import Columns from '../Columns/Columns';

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
        <div>
            <h2>
                {board.name}
                <button onClick={handleDeleteBoard}><Cross2Icon /></button>
            </h2>

            <ColumnForm boardId={boardId} />

            <Columns boardId={boardId} />
        </div>
     );
}
 
export default Board;