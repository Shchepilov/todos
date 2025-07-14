import { useRef } from 'react';
import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import styles from './Board.module.scss';
import { deleteBoard, updateBoard } from '@features/boards/services/boardsQuery';

const BoardSettings = ({board}) => {
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const closeDialogRef = useRef(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, } = useForm();
    const { register: registerWatcher, handleSubmit: handleSubmitWatcher, formState: { errors: watcherErrors }, reset: resetWatcher } = useForm();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleDeleteBoard = async () => {
        await deleteBoard(board.id);
        await setActiveBoardId(null);
        navigate('/boards');
    };    

    const handleUpdateBoard = (data) => {
        const { boardName } = data;

        updateBoard(board.id, { name: boardName });
        closeDialog();
    };

    const handleAddWatcher = (data) => {
        const { watcherEmail, watcherName } = data;
        
        if (board.watchers.includes(watcherEmail)) return;

        updateBoard(board.id, { 
            watchers: [...board.watchers, watcherEmail],
            watchersData: [...board.watchersData, { watcherEmail, watcherName }]
        });

        resetWatcher();
    }

    const handleRemoveWatcher = (email) => {
        const updatedWatchers = board.watchers.filter(watcherEmail => watcherEmail !== email);
        const updatedWatchersData = board.watchersData.filter(watcher => watcher.watcherEmail !== email);

        updateBoard(board.id, { watchers: updatedWatchers, watchersData: updatedWatchersData });
    }

    return (
        <>
            <div className={styles.settings}>
                <Form.Root onSubmit={handleSubmit(handleUpdateBoard)} className="form" id="boardSettingForm">
                    <Field name="boardName" label="Board Name" errors={errors}>
                        <Input
                            register={register}
                            defaultValue={board.name}
                            name="boardName"
                            placeholder="Board Name"
                            autoFocus
                            errors={errors}
                            required="Field is required"
                            maxLength={{
                                value: 20,
                                message: "Title cannot exceed 20 characters"
                            }}
                        />
                    </Field>
                </Form.Root>
                            
                <Form.Root onSubmit={handleSubmitWatcher(handleAddWatcher)} className="form">
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
                        <Field name="watcherEmail" errors={watcherErrors}>
                            <Input
                                register={registerWatcher}
                                name="watcherEmail"
                                placeholder="Email"
                                errors={watcherErrors}
                                required="Email is required"
                                pattern={{
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format"
                                }}
                            />
                        </Field>
                        <span>aka</span>
                        <Field name="watcherName" errors={watcherErrors}>
                            <Input
                                register={registerWatcher}
                                name="watcherName"
                                placeholder="Name"
                                errors={watcherErrors}
                                required="Name is required"
                            />
                        </Field>

                        <Button type="submit" variation="confirmation">
                            <PlusIcon width={18} height={18} />
                        </Button>
                    </div>
                </Form.Root>
            </div>

            <div className={styles.buttonGroup}>
                <Button variation="confirmation" type="button" className={styles.removeBoardButton} onClick={handleDeleteBoard}>
                    <TrashIcon width={18} height={18} /> Delete Board
                </Button>
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" form="boardSettingForm">Save</Button>
                <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
            </div>
        </>
    );
}
 
export default BoardSettings;
