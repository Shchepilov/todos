import { useStore } from "@store/store";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import { ReaderIcon, TrashIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Modal from "@components/Modal/Modal";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Row from "@components/Row/Row";
import Button from '@components/Button/Button';
import LogsForm from './logsForm';
import ProgressBar from "@features/boards/components/ProgressBar/ProgressBar";
import styles from './Task.module.scss';
import { updateTask, deleteTask } from '@features/boards/services/tasksQuery';
import { TASK_STATUS, TASK_TYPES } from '@features/boards/utils/constants';

const TaskDetail = () => {
    const intl = useIntl();
    const { boardId, taskId } = useParams();
    const navigate = useNavigate();
    const columns = useStore((state) => state.columns);
    const tasks = useStore((state) => state.tasks);
    const task = tasks.find(task => task.id === taskId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const isWatcher = activeBoard?.isWatcher || false;

    const userEmail = useStore((state) => state.user.providerData[0].email);
    const ownerName = activeBoard.owner.name;
    const userName = activeBoard.watchersData.find(watcher => watcher.watcherEmail === userEmail)?.watcherName || ownerName;

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const closeModal = () => {
        navigate(`/boards/${boardId}`);
    };
    
    const handleUpdateTask = (data) => {
        const { taskType, taskTitle, taskPriority, taskAssignee, taskDescription, columnId, taskEstimation } = data;

        updateTask(task.id, {
            assignee: taskAssignee,
            type: taskType,
            title: taskTitle,
            priority: taskPriority,
            description: taskDescription,
            columnId: columnId,
            estimation: taskEstimation || null
        });

        closeModal();
    };

    const handleDeleteTask = () => {
        deleteTask(task.id);
        closeModal();
    }

    return (
        <Modal heading={`${activeBoard.prefix} - ${task.number}`} size="medium" isDialogOpen={true} setIsDialogOpen={closeModal}>
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
                
                {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                    <Field name="taskAssignee" label={intl.formatMessage({ id: 'boards.taskAssignee' })} errors={errors}>
                        <Select register={register} 
                                name="taskAssignee" 
                                items={activeBoard.watchersData} 
                                nameKey="watcherName" 
                                valueKey="watcherName"
                                defaultValue={task.assignee}>
                            <option value="unassigned">{intl.formatMessage({ id: 'boards.unassigned' })}</option>
                            <option value={activeBoard.owner.name}>{activeBoard.owner.name}</option>
                        </Select>
                    </Field>
                )}

                <Field name="taskDescription" label={intl.formatMessage({ id: 'boards.taskDescription' })} errors={errors}>
                    <textarea 
                        defaultValue={task.description}
                        rows={5} 
                        {...register("taskDescription", { 
                            maxLength: {
                                value: 200,
                                message: intl.formatMessage({ id: 'boards.validation.descriptionMaxLength' }, { length: 200 })
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
                            value: /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/,
                            message: intl.formatMessage({ id: 'boards.validation.estimationFormat' })
                        }}
                        maxLength={{
                            value: 15,
                            message: intl.formatMessage({ id: 'boards.validation.estimationMaxLength' }, { length: 15 })
                        }}
                    />
                </Field>
            </Form.Root>

            <section className={styles.logSection}>
                {(task.estimation && task.loggedTime) ? (
                    <ProgressBar estimation={task.estimation} loggedTime={task.loggedTime} />
                ) : (task.loggedTime && (
                    <p className={styles.loggedTime}>
                        <FormattedMessage id="boards.logged" />: {task.loggedTime}
                    </p>
                ))}

                <LogsForm task={task} userName={userName} loggedTime={task.loggedTime} />
            </section>

            <Row justify="between" > 
                {!isWatcher && (
                    <Button type="button" variation="confirmation" onClick={handleDeleteTask}>
                        <TrashIcon width={18} height={18} /> 
                        <FormattedMessage id="common.delete" />
                    </Button>
                )}
                <Button type="submit" form="taskDetailForm">
                   <ReaderIcon /> 
                   <FormattedMessage id="common.save" />
                </Button>
            </Row>
        </Modal>
    );
};

export default TaskDetail;
