import { useState } from "react";
import { useStore } from "@store/store";
import { useAuthUser } from "@baseUrl/auth/useAuthUser";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import { ReaderIcon, TrashIcon } from "@radix-ui/react-icons";
import TaskCopyMenu from "./TaskCopyMenu";
import { useIntl, FormattedMessage } from 'react-intl';
import Modal from "@components/Modal/Modal";
import ConfirmationModal from "@components/ConfirmationModal/ConfirmationModal";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Row from "@components/Row/Row";
import Button from '@components/Button/Button';
import LogsForm from './logsForm';
import ProgressBar from "@features/boards/components/ProgressBar/ProgressBar";
import styles from './Task.module.scss';
import { updateTask, deleteTask } from '@features/boards/services/tasksQuery';
import { TASK_STATUS, TASK_TYPES, ESTIMATION_PATTERN, ESTIMATION_MAX_LENGTH } from '@features/boards/utils/constants';
import { getLoggedTime } from '@features/boards/utils/helpers';
import useTask from '@features/boards/hooks/useTask';

// Board renders this only for a board that exists, and passes it in.
const TaskDetail = ({ board: activeBoard }) => {
    const intl = useIntl();
    const { taskId } = useParams();
    const navigate = useNavigate();
    const columns = useStore((state) => state.columns);
    const { task, taskLoading, taskError } = useTask(taskId);
    const boardId = activeBoard.id;
    const isWatcher = activeBoard.isWatcher || false;

    const userEmail = useAuthUser().providerData[0].email;
    const ownerName = activeBoard.owner.name;
    const userName = activeBoard.watchersData.find(watcher => watcher.watcherEmail === userEmail)?.watcherName || ownerName;

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

    // Denied by the rules or an invalid id: show the error page instead of closing silently.
    if (taskError) throw taskError;
    if (taskLoading) return null;
    // Deleted by another member while open, or a link to a task of another board.
    if (!task || task.boardId !== boardId) return <Navigate to={`/boards/${boardId}`} replace />;

    const closeModal = () => {
        navigate(`/boards/${boardId}`);
    };
    
    const handleUpdateTask = (data) => {
        const { taskType, taskTitle, taskPriority, taskAssignee, taskDescription, columnId, taskEstimation, taskSprint } = data;

        updateTask(task.id, {
            assignee: taskAssignee,
            type: taskType,
            title: taskTitle,
            priority: taskPriority,
            description: taskDescription,
            columnId: columnId,
            estimation: taskEstimation || null,
            sprint: taskSprint || null
        });

        closeModal();
    };

    const handleDeleteTask = () => {
        deleteTask(task.id);
        closeModal();
    }

    const loggedTime = getLoggedTime(task);

    return (
        <Modal heading={
            <div className={styles.modalHeader}>
                <span>{`${activeBoard.prefix}-${task.number}`}</span>
                <TaskCopyMenu task={task} activeBoard={activeBoard} />
            </div>
        } size="medium" isDialogOpen={true} setIsDialogOpen={closeModal}>
            <Form.Root onSubmit={handleSubmit(handleUpdateTask)} className="form" id="taskDetailForm">
                    
                <Field name="taskType" label={intl.formatMessage({ id: 'boards.taskType' })} errors={errors}>
                    <Select register={register} name="taskType" items={TASK_TYPES} defaultValue={task.type} />
                </Field>

                <Field name="taskTitle" label={intl.formatMessage({ id: 'boards.taskTitle' })} required errors={errors}>
                    <Input
                        register={register}
                        defaultValue={task.title}
                        name="taskTitle"
                        placeholder={intl.formatMessage({ id: 'boards.taskTitle' })}
                        autoFocus
                        errors={errors}
                        required={intl.formatMessage({ id: 'common.validation.titleRequired' })}
                        maxLength={{
                            value: 100,
                            message: intl.formatMessage({ id: 'boards.validation.titleMaxLength' }, { length: 100 })
                        }}
                    />
                </Field>

                <Row equal>
                    <Field name="taskPriority" label={intl.formatMessage({ id: 'common.priority' })} errors={errors}>
                        <Select register={register} name="taskPriority" items={TASK_STATUS} defaultValue={task.priority} />
                    </Field>

                    <Field name="columnId" label={intl.formatMessage({ id: 'boards.taskColumn' })} errors={errors}>
                        <Select register={register} name="columnId" items={columns} valueKey="id" defaultValue={task.columnId} />
                    </Field>
                </Row>
                
                <Field name="taskAssignee" label={intl.formatMessage({ id: 'boards.taskAssignee' })} errors={errors}>
                    <Select register={register} 
                            name="taskAssignee" 
                            items={activeBoard.watchersData} 
                            nameKey="watcherName" 
                            valueKey="watcherName"
                            defaultValue={task.assignee}>
                        <option value="unassigned"><FormattedMessage id="boards.unassigned" /></option>
                        <option value={activeBoard.owner.name}>{activeBoard.owner.name}</option>
                    </Select>
                </Field>

                {activeBoard.sprints && activeBoard.sprints.length > 0 && (
                    <Field name="taskSprint" label={intl.formatMessage({ id: 'boards.taskSprint' })} errors={errors}>
                        <Select register={register} 
                                name="taskSprint" 
                                items={activeBoard.sprints} 
                                nameKey="name" 
                                valueKey="id"
                                defaultValue={task.sprint}>
                            <option value=""><FormattedMessage id="boards.noSprint" /></option>
                        </Select>
                    </Field>
                )}

                <Field name="taskDescription" label={intl.formatMessage({ id: 'boards.taskDescription' })} errors={errors}>
                    <textarea 
                        defaultValue={task.description}
                        rows={5} 
                        {...register("taskDescription", { 
                            maxLength: {
                                value: 600,
                                message: intl.formatMessage({ id: 'boards.validation.descriptionMaxLength' }, { length: 600 })
                            }})
                        }
                        placeholder={intl.formatMessage({ id: 'boards.taskDescription' })} />
                </Field>

                <Field name="taskEstimation" label={intl.formatMessage({ id: 'boards.taskEstimation' })} errors={errors}>
                    <Input
                        register={register}
                        name="taskEstimation"
                        placeholder="0d 0h 0m"
                        defaultValue={task.estimation}
                        errors={errors}
                        pattern={{
                            value: ESTIMATION_PATTERN,
                            message: intl.formatMessage({ id: 'boards.validation.estimationFormat' })
                        }}
                        maxLength={{
                            value: ESTIMATION_MAX_LENGTH,
                            message: intl.formatMessage({ id: 'boards.validation.estimationMaxLength' }, { length: ESTIMATION_MAX_LENGTH })
                        }}
                    />
                </Field>
            </Form.Root>

            <section className={styles.logSection}>
                {task.estimation ? (
                    <ProgressBar estimation={task.estimation} loggedTime={loggedTime} />
                ) : (loggedTime && (
                    <p className={styles.loggedTime}>
                        <FormattedMessage id="boards.logged" />: {loggedTime}
                    </p>
                ))}

                <LogsForm task={task} userName={userName} />
            </section>

            <Row justify="between" > 
                {!isWatcher && (
                    <Button type="button" variation="confirmation" onClick={() => setDeleteConfirmModal(true)}>
                        <TrashIcon width={18} height={18} />
                        <FormattedMessage id="common.delete" />
                    </Button>
                )}
                <Button type="submit" form="taskDetailForm">
                   <ReaderIcon />
                   <FormattedMessage id="common.save" />
                </Button>
            </Row>

            <ConfirmationModal
                heading={intl.formatMessage({ id: 'boards.deleteTask' })}
                message={<FormattedMessage id="boards.deleteTaskConfirm" />}
                isDialogOpen={deleteConfirmModal}
                setIsDialogOpen={setDeleteConfirmModal}
                onConfirm={handleDeleteTask}
            />
        </Modal>
    );
};

export default TaskDetail;
