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
    const [watcherName, setWatcherName] = useState('');
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

    const handleAddWatcher = (e) => {
        e.preventDefault();

        if (!watcherEmail || !watcherName) return;
        if (board.watchers.includes(watcherEmail)) return;

        updateBoard(board.id, { 
            watchers: [...board.watchers, watcherEmail],
            watchersData: [...board.watchersData, { watcherEmail, watcherName }]
        });
        
        setWatcherEmail('');
        setWatcherName('');
    }

    const handleRemoveWatcher = (email) => {
        const updatedWatchers = board.watchers.filter(watcherEmail => watcherEmail !== email);
        console.log(updatedWatchers);
        const updatedWatchersData = board.watchersData.filter(watcher => watcher.watcherEmail !== email);
        updateBoard(board.id, { watchers: updatedWatchers, watchersData: updatedWatchersData });
    }

    const handleChangeWatcherEmail = (e) => {
        setWatcherEmail(e.target.value.trim().toLowerCase());
    }

    const handleChangeWatcherName = (e) => {
        setWatcherName(e.target.value.trim());
    }

    return ( 
        <form onSubmit={handleUpdateBoard} className="form">
            <div className="field">
                <label className="label">Board Name</label>
                <input type="text" value={boardName} onChange={handleChangeName} />
            </div>

            <div className="field">
                <label className="label">Watchers</label>
                {board.watchersData && board.watchersData.length > 0 && (
                    <ul className={styles.watcherList}>
                        {board.watchersData.map((user) => (
                            <li key={user.watcherEmail}>
                                <span>{user.watcherEmail} - {user.watcherName}</span>
                                <Button type="button" variation="transparent" onClick={() => handleRemoveWatcher(user.watcherEmail)}>
                                    <CrossCircledIcon />
                                </Button>
                            </li>
                        ))}
                    </ul>    
                )}

                <div className="field split-field">
                    <input type="email" value={watcherEmail} onChange={handleChangeWatcherEmail} placeholder="email" />
                    <span>aka</span>
                    <input type="text" value={watcherName} onChange={handleChangeWatcherName} placeholder="name" />
                    <Button type="button" variation="confirmation" onClick={handleAddWatcher}>
                        <PlusIcon width={18} height={18} />
                    </Button>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <Button variation="confirmation" type="button" className={styles.removeBoardButton} onClick={handleDeleteBoard}>
                    <TrashIcon width={18} height={18} /> Delete Board
                </Button>
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!boardName}>Save</Button>
                <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
            </div>
        </form>
    );
}
 
export default BoardSettings;
