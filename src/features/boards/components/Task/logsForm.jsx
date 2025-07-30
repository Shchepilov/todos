import { useStore } from "@store/store";
import { CrossCircledIcon, LapTimerIcon } from "@radix-ui/react-icons";
import dayjs from 'dayjs';
import * as Form from '@radix-ui/react-form';
import { useForm } from "react-hook-form"
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import { addLoggedTime } from "@features/boards/utils/helpers";
import { updateTask } from '@features/boards/services/tasksQuery';
import Button from '@components/Button/Button';
import Row from "@components/Row/Row";
import styles from './Task.module.scss';

const LogsForm = ({ task, userName, loggedTime }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");

    const handleUpdateLogs = (data) => {
        const { logDate, logTime } = data;
        
        const updatedLoggedTime = addLoggedTime(loggedTime ?? '0m', logTime);

        updateTask(task.id, { 
            loggedTime: updatedLoggedTime,
            workLogsList: [
                ...task.workLogsList,
                {
                    id: Date.now(),
                    date: logDate,
                    time: logTime,
                    name: userName,
                }
            ]
        });

        reset();
    }

    const handleRemoveLog = (logId) => {
        const updatedWorkLogs = task.workLogsList.filter(log => log.id !== logId);
        const updatedLoggedTime = updatedWorkLogs.reduce((total, log) => addLoggedTime(total, log.time), '0m');

        updateTask(task.id, {
            loggedTime: updatedLoggedTime,
            workLogsList: updatedWorkLogs
        });
    }

    return (
        <>
            {task.workLogsList.length > 0 && (
                <ul className={styles.logsList}>
                    {task.workLogsList.map((log, index) => (
                        <li key={index}>
                            <div className={styles.logItem}>
                                <span className={styles.logItemDate}>{log.date}</span>
                                <span className={styles.logItemTime}>{log.time}</span>
                                <span>{log.name}</span>
                            </div>
                            <Button type="button" variation="transparent" onClick={() => handleRemoveLog(log.id)}>
                                <CrossCircledIcon />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <Form.Root onSubmit={handleSubmit(handleUpdateLogs)} className="form">
                <Row equal align="end">
                    <Field name="logDate" label="Log Date" errors={errors}>
                        <Input
                            register={register}
                            required="Field is required"
                            name="logDate"
                            type="date"
                            defaultValue={currentDate}
                            errors={errors}
                        />
                    </Field>
                    <Field name="logTime" label="Log time (3d 2h 30m)" errors={errors}>
                        <Input
                            register={register}
                            name="logTime"
                            placeholder="0d 0h 0m"
                            errors={errors}
                            required="Field is required"
                            pattern={{
                                value: /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/,
                                message: "Please use format: 3d 2h 30m"
                            }}
                            maxLength={{
                                value: 15,
                                message: "Estimation cannot exceed 15 characters"
                            }}
                        />
                    </Field>
                    <Button type="submit" className={styles.addLogButton}>
                        <LapTimerIcon />
                    </Button>
                </Row>
            </Form.Root>
        </>
    );
}

export default LogsForm;
