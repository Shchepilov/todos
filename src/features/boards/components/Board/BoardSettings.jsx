import { useRef } from 'react';
import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import Row from "@components/Row/Row";
import styles from './Board.module.scss';
import { deleteBoard, updateBoard } from '@features/boards/services/boardsQuery';

const BoardSettings = ({board}) => {
    const intl = useIntl();
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const closeDialogRef = useRef(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerWatcher, handleSubmit: handleSubmitWatcher, formState: { errors: watcherErrors }, reset: resetWatcher } = useForm();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleDeleteBoard = async () => {
        await deleteBoard(board.id);
        await setActiveBoardId(null);
        navigate('/boards');
    };    

    const handleUpdateBoard = (data) => {
        const { boardName, ownerName } = data;

        updateBoard(board.id, { name: boardName, owner: { name: ownerName, email: board.owner.email } });
        closeDialog();
    };

    const handleAddWatcher = (data) => {
        const { watcherEmail, watcherName } = data;

        if (board.watchers.includes(watcherEmail) || board.owner === watcherEmail) return;

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
                    <Row equal>
                        <Field name="boardName" required label={intl.formatMessage({ id: 'boards.boardName' })} errors={errors}>
                            <Input
                                register={register}
                                defaultValue={board.name}
                                name="boardName"
                                placeholder={intl.formatMessage({ id: 'boards.boardName' })}
                                autoFocus
                                errors={errors}
                                required={intl.formatMessage({ id: 'common.required' })}
                                maxLength={{
                                    value: 20,
                                    message: intl.formatMessage({ id: 'boards.validation.boardNameMaxLength' }, { length: 20 })
                                }}
                            />
                        </Field>
                        <Field name="boardPrefix" label={intl.formatMessage({ id: 'boards.boardPrefix' })} errors={errors} className={styles.boardPrefix}>
                            <Input
                                register={register}
                                defaultValue={board.prefix}
                                name="boardPrefix"
                                disabled
                                errors={errors}
                            />
                        </Field>
                    </Row>
                    
                    <Row equal>
                        <Field name="ownerEmail" label={intl.formatMessage({ id: 'boards.ownerEmail' })} errors={errors}>
                            <Input
                                register={register}
                                defaultValue={board.owner.email}
                                name="ownerEmail"
                                disabled
                                errors={errors}
                            />
                        </Field>

                        <Field name="ownerName" label={intl.formatMessage({ id: 'boards.ownerName' })} required errors={errors}>
                            <Input
                                register={register}
                                defaultValue={board.owner.name}
                                name="ownerName"
                                placeholder={intl.formatMessage({ id: 'boards.ownerName' })}
                                errors={errors}
                                required={intl.formatMessage({ id: 'common.required' })}
                                maxLength={{
                                    value: 30,
                                    message: intl.formatMessage({ id: 'boards.validation.boardNameMaxLength' }, { length: 30 })
                                }}
                            />
                        </Field>
                    </Row>
                </Form.Root>

                <Form.Root onSubmit={handleSubmitWatcher(handleAddWatcher)} className="form">
                    <label className="label">{intl.formatMessage({ id: 'boards.watchers' })}</label>

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

                    <Row align="center">
                        <Field name="watcherEmail" errors={watcherErrors}>
                            <Input
                                register={registerWatcher}
                                name="watcherEmail"
                                placeholder={intl.formatMessage({ id: 'boards.watcherEmail' })}
                                errors={watcherErrors}
                                required={intl.formatMessage({ id: 'boards.validation.emailRequired' })}
                                pattern={{
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: intl.formatMessage({ id: 'boards.validation.invalidEmail' })
                                }}
                                validate={value => value !== board.owner.email || intl.formatMessage({ id: 'boards.validation.alreadyOwner' })}
                            />
                        </Field>
                        <span>aka</span>
                        <Field name="watcherName" errors={watcherErrors}>
                            <Input
                                register={registerWatcher}
                                name="watcherName"
                                placeholder={intl.formatMessage({ id: 'boards.watcherName' })}
                                errors={watcherErrors}
                                required={intl.formatMessage({ id: 'boards.validation.nameRequired' })}
                            />
                        </Field>

                        <Button type="submit" variation="confirmation">
                            <PlusIcon width={18} height={18} />
                        </Button>
                    </Row>
                </Form.Root>
            </div>

            <div className={styles.buttonGroup}>
                <Button variation="confirmation" type="button" className={styles.removeBoardButton} onClick={handleDeleteBoard}>
                    <TrashIcon width={18} height={18} /> {intl.formatMessage({ id: 'boards.deleteBoard' })}
                </Button>
                <Button type="button" variation="secondary" onClick={closeDialog}>{intl.formatMessage({ id: 'common.cancel' })}</Button>
                <Button type="submit" form="boardSettingForm">{intl.formatMessage({ id: 'common.save' })}</Button>
                <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
            </div>
        </>
    );
}
 
export default BoardSettings;
