import { useRef, useState } from 'react';
import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import Button from '@components/Button/Button';
import styles from './Board.module.scss';
import { deleteBoard, updateBoard } from '@features/boards/services/boardsQuery';

const BoardSettings = ({board}) => {
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const [boardName, setBoardName] = useState(board.name);
    const [watcherEmail, setWatcherEmail] = useState('');
    const closeDialogRef = useRef(null);
    const navigate = useNavigate();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleDeleteBoard = async () => {
        await deleteBoard(board.id);
        await setActiveBoardId(null);
        navigate('/boards');
    };

    const handleChangeName = (e) => {
        setBoardName(e.target.value);
    }

    const handleUpdateBoard = (e) => {
        e.preventDefault();
        if (!boardName) return;

        updateBoard(board.id, { name: boardName });

        closeDialog();
    };

    const addWatcherEmail = (e) => {
        e.preventDefault();

        if (!watcherEmail) return;
        if (board.watchers.includes(watcherEmail)) return;

        updateBoard(board.id, { watchers: [...board.watchers, watcherEmail] });
        setWatcherEmail('');
    }

    const removeWatcherEmail = (email) => {
        const updatedWatchers = board.watchers.filter(item => item !== email);
        updateBoard(board.id, { watchers: updatedWatchers });
    }

    const handleChangeWatcherEmail = (e) => {
        setWatcherEmail(e.target.value.trim().toLowerCase());
    }

    return ( 
        <form onSubmit={handleUpdateBoard} className="form">
            <div className="field">
                <label className="label">Board Name</label>
                <input type="text" value={boardName} onChange={handleChangeName} />
            </div>

            <div className="field">
                <label className="label">Watchers</label>
                {board.watchers.length > 0 && (
                    <ul className={styles.watcherList}>
                        {board.watchers.map((item) => (
                            <li key={item}>
                                <span>{item}</span>
                                <Button type="button" variation="transparent" onClick={() => removeWatcherEmail(item)}>
                                    <CrossCircledIcon />
                                </Button>
                            </li>
                        ))}
                    </ul>    
                )}

                <div className="field split-field">
                    <input type="email" value={watcherEmail} onChange={handleChangeWatcherEmail} placeholder="Add email" />
                    <Button type="button" variation="confirmation" onClick={addWatcherEmail}>
                        <PlusIcon width={18} height={18} />
                    </Button>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <Button variation="confirmation" type="button" className={styles.removeBoardButton} onClick={handleDeleteBoard}>
                    <TrashIcon width={18} height={18} />
                </Button>
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!boardName}>Save</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
}
 
export default BoardSettings;
