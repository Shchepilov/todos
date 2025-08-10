import { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { PlusIcon, GearIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import { useStore } from "@store/store";
import Button from '@components/Button/Button';
import Modal from "@components/Modal/Modal";
import ColumnForm from '@features/boards/components/Column/ColumnForm';
import Columns from '@features/boards/components/Columns/Columns';
import TaskDetail from '@features/boards/components/Task/TaskDetail';
import TaskFilter from '@features/boards/components/TaskFilter/TaskFilter';
import { updateBoard } from '@features/boards/services/boardsQuery';
import BoardSettings from './BoardSettings';
import useBoardData from '@features/boards/hooks/useBoardData';
import styles from './Board.module.scss';

const Board = () => {
    const intl = useIntl();
    const user = useStore((state) => state.user);   
    const boards = useStore((state) => state.boards);
    const columns = useStore((state) => state.columns);
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const [columnFormModal, setColumnFormModal] = useState(false);
    const [boardSettingsModal, setBoardSettingsModal] = useState(false);
    const { boardId } = useParams();
    const board = boards.find(board => board.id === boardId);
    const navigate = useNavigate();

    const isBoardHasTasks = useStore((state) => state.tasks);

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

    const handleLeaveBoard = () => {
        const updatedWatchers = board.watchers.filter(email => email !== user.providerData[0].email);
        const updatedWatchersData = board.watchersData.filter(watcher => watcher.watcherEmail !== user.providerData[0].email);
        updateBoard(board.id, { watchers: updatedWatchers, watchersData: updatedWatchersData });
    }

    return ( 
        <main className={styles.board}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{board.name}</h2>

                    {board.isWatcher ? (
                        <Button variation="transparent" className={styles.leaveBoardButton} onClick={handleLeaveBoard}>
                            <FormattedMessage id="boards.leaveBoard" />
                        </Button>
                    ) : (
                        <Button variation="transparent" onClick={showBoardSettings}>
                            <GearIcon className={columnsLoading ? styles.loading : ''} />
                        </Button>
                    )}

                    {isBoardHasTasks.length > 0 && <TaskFilter />}
                </div>

                <Button size='small' className={styles.addColumnButton} onClick={showColumnForm}>
                    <PlusIcon width={16} height={16}/>
                    <FormattedMessage id="boards.addColumn" />
                </Button>
            </header>

            <Modal heading={intl.formatMessage({ id: 'column.add' })} isDialogOpen={columnFormModal} setIsDialogOpen={setColumnFormModal}>
                <ColumnForm boardId={boardId} />
            </Modal>

            <Modal heading={intl.formatMessage({ id: 'common.settings' })} size='medium' isDialogOpen={boardSettingsModal} setIsDialogOpen={setBoardSettingsModal}>
                <BoardSettings board={board} />
            </Modal>

            {columns.length === 0 ? (
                <div className={styles.noColumns}>
                    <p><FormattedMessage id="boards.noColumns" /></p>
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
