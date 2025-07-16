import { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { PlusIcon, GearIcon } from "@radix-ui/react-icons";
import { useStore } from "@store/store";
import Button from '@components/Button/Button';
import Modal from "@components/Modal/Modal";
import ColumnForm from '@features/boards/components/Column/ColumnForm';
import Columns from '@features/boards/components/Columns/Columns';
import TaskDetail from '@features/boards/components/Task/TaskDetail';
import BoardSettings from './BoardSettings';
import styles from './Board.module.scss';

import useBoardData from '@features/boards/hooks/useBoardData';

const Board = () => {
    const boards = useStore((state) => state.boards);
    const columns = useStore((state) => state.columns);
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const [columnFormModal, setColumnFormModal] = useState(false);
    const [boardSettingsModal, setBoardSettingsModal] = useState(false);
    const { boardId } = useParams();
    const board = boards.find(board => board.id === boardId);
    const navigate = useNavigate();

    const { columnsLoading, columnsError, tasksLoading, tasksError } = useBoardData(boardId);

    useEffect(() => {
        if (!board) {
            setActiveBoardId(null);
            navigate('/boards');
        }
    }, [board]);
    
    if (!board) return;

    const showColumnForm = () => {
        setColumnFormModal(true);
    }

    const showBoardSettings = () => {
        setBoardSettingsModal(true);
    }

    return ( 
        <main className={styles.board}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{board.name} {board.isWatcher && <span> (watcher)</span>}</h2>

                    {!board.isWatcher && (
                        <Button variation="transparent" onClick={showBoardSettings}>
                            <GearIcon className={columnsLoading ? styles.loading : ''} />
                        </Button>
                    )}
                </div>

                <Button size='small' className={styles.addColumnButton} onClick={showColumnForm}>
                    <PlusIcon width={16} height={16}/> Column
                </Button>
            </header>

            <Modal heading='+ Add Column' isDialogOpen={columnFormModal} setIsDialogOpen={setColumnFormModal}>
                <ColumnForm boardId={boardId} />
            </Modal>

            <Modal heading='Settings' size='medium' isDialogOpen={boardSettingsModal} setIsDialogOpen={setBoardSettingsModal}>
                <BoardSettings board={board} />
            </Modal>

            {columns.length === 0 ? (
                <div className={styles.noColumns}>
                    <p>No Columns</p>
                </div>
            ) : (
                <Columns boardId={boardId} isWatcher={board.isWatcher} />
            )}

            <Routes>
                <Route path="tasks/:taskId" element={<TaskDetail />} />
            </Routes>
        </main>
     );
}
 
export default Board;
