import { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { TrashIcon, PlusIcon, GearIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useStore } from "@store/store";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Button from '@components/Button/Button';
import Modal from "@components/Modal/Modal";
import ColumnForm from './ColumnForm';
import Columns from '../Columns/Columns';
import TaskDetail from '../Task/TaskDetail';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import styles from './Board.module.scss';

const Board = () => {
    const boards = useStore((state) => state.boards);
    const deleteBoard = useStore((state) => state.deleteBoard);
    const [columnFormModal, setColumnFormModal] = useState(false);
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

    const showColumnForm = () => {
        setColumnFormModal(true);
    }

    return ( 
        <main className={styles.board}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{board.name}</h2>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button variation="transparent">
                                <GearIcon width={18} height={18} />
                            </Button>
                        </DropdownMenu.Trigger>
        
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                                <DropdownMenu.Item className={dropdown.item} onSelect={() => console.log('Edit')}>
                                    <Pencil1Icon /> Edit
                                </DropdownMenu.Item>
        
                                <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={handleDeleteBoard}>
                                    <TrashIcon /> Delete Board
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

                <Button size='small' className={styles.addColumnButton} onClick={showColumnForm}>
                    <PlusIcon width={16} height={16}/> Column
                </Button>
            </header>

            <Modal heading='+ Add Column' isDialogOpen={columnFormModal} setIsDialogOpen={setColumnFormModal}>
                <ColumnForm boardId={boardId} />
            </Modal>

            <Columns boardId={boardId} />

            {/* Task Detail Modal Route */}
            <Routes>
                <Route path="tasks/:taskId" element={<TaskDetail />} />
            </Routes>
        </main>
     );
}
 
export default Board;
