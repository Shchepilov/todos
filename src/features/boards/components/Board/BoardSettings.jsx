import { useRef } from 'react';
import { useStore } from "@store/store";
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
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
    const { register: registerSprint, handleSubmit: handleSubmitSprint, formState: { errors: sprintErrors }, reset: resetSprint } = useForm();

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

    const handleAddSprint = (data) => {
        const { sprintName } = data;
        const sprintId = sprintName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9а-яё-]/gi, '');
        
        if (board.sprints?.some(sprint => sprint.id === sprintId)) return;
        
        updateBoard(board.id, { 
            sprints: [...board.sprints, { id: sprintId, name: sprintName }]
        });

        resetSprint();
    }

    const handleRemoveSprint = (sprintId) => {
        const updatedSprints = board.sprints.filter(sprint => sprint.id !== sprintId);
        
        updateBoard(board.id, { 
            sprints: updatedSprints,
            activeSprint: board.activeSprint === sprintId ? null : board.activeSprint
        });
    }

    return (
        <>
            <div className={styles.settings}>
                <Form.Root onSubmit={handleSubmit(handleUpdateBoard)} className="form" id="boardSettingForm">
                    <Row equal>
                        <Field name="boardName" required label={intl.formatMessage({ id: 'common.title' })} errors={errors}>
                            <Input
                                register={register}
                                defaultValue={board.name}
                                name="boardName"
                                placeholder={intl.formatMessage({ id: 'common.title' })}
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
                
                <section className={styles.fromSection}>
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
                    
                    <Form.Root onSubmit={handleSubmitWatcher(handleAddWatcher)} className="form">
                        <Row align="center">
                            <Field name="watcherEmail" errors={watcherErrors}>
                                <Input
                                    register={registerWatcher}
                                    name="watcherEmail"
                                    placeholder={intl.formatMessage({ id: 'common.email' })}
                                    errors={watcherErrors}
                                    required={intl.formatMessage({ id: 'common.validation.emailRequired' })}
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
                                    placeholder={intl.formatMessage({ id: 'common.name' })}
                                    errors={watcherErrors}
                                    required={intl.formatMessage({ id: 'common.validation.nameRequired' })}
                                />
                            </Field>

                            <Button type="submit" variation="confirmation">
                                <PlusIcon width={18} height={18} />
                            </Button>
                        </Row>
                    </Form.Root>
                </section>
                <section className={styles.fromSection}>
                    <label className="label"><FormattedMessage id="boards.sprints" /></label>

                    {board.sprints && board.sprints.length > 0 && (
                        <ul className={styles.watcherList}>
                            {board.sprints.map((sprint) => (
                                <li key={sprint.id}>
                                    <span>{sprint.name}</span>
                                    <Button type="button" variation="transparent" onClick={() => handleRemoveSprint(sprint.id)}>
                                        <CrossCircledIcon />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Form.Root onSubmit={handleSubmitSprint(handleAddSprint)} className="form">
                        <Row align="center">
                            <Field name="sprintName" errors={sprintErrors}>
                                <Input
                                    register={registerSprint}
                                    name="sprintName"
                                    placeholder={intl.formatMessage({ id: 'boards.sprintName' })}
                                    errors={sprintErrors}
                                    required={intl.formatMessage({ id: 'common.required' })}
                                    maxLength={{
                                        value: 20,
                                        message: intl.formatMessage({ id: 'boards.validation.sprintNameMaxLength' }, { length: 20 })
                                    }}
                                    validate={value => !board.sprints?.some(sprint => sprint.name.toLowerCase() === value.toLowerCase()) || intl.formatMessage({ id: 'boards.validation.sprintAlreadyExists' })}
                                />
                            </Field>

                            <Button type="submit" variation="confirmation">
                                <PlusIcon width={18} height={18} />
                            </Button>
                        </Row>
                    </Form.Root>
                </section>
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
