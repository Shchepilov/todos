import { useForm } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import { useIntl, FormattedMessage } from 'react-intl';
import Select from '@components/Select/Select';
import Input from '@components/Input/Input';
import Field from '@components/Field/Field';
import Button from '@components/Button/Button';
import PokerDeck from '@features/boards/components/Planning/components/PokerDeck/PokerDeck';
import VotesPanel from '@features/boards/components/Planning/components/VotesPanel/VotesPanel';
import TypeBadge from "@features/boards/components/Task/TypeBadge";
import { ESTIMATION_PATTERN, ESTIMATION_MAX_LENGTH } from '@features/boards/utils/constants';
import styles from './PlanningTaskPanel.module.scss';

const PlanningTaskPanel = ({
    taskId, task, board, planning, isOwner, userEmail, participants,
    onApply, onStartEstimation, onVote, onReveal
}) => {
    const intl = useIntl();
    const { register, handleSubmit, formState: { errors } } = useForm();

    if (!taskId) {
        return (
            <div className={`${styles.panel} ${styles.panelPlaceholder}`}>
                <FormattedMessage id="boards.planning.selectTask" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className={`${styles.panel} ${styles.panelPlaceholder}`}>
                <FormattedMessage id="boards.planning.taskUnavailable" />
            </div>
        );
    }

    const isSessionForThisTask = Boolean(planning) && planning.taskId === task.id;
    const myVote = planning?.votes?.find(vote => vote.email === userEmail)?.value;

    const handleApply = (data) => {
        onApply(task.id, {
            assignee: data.assignee,
            estimation: data.estimation.trim()
        });
    };

    return (
        <div className={styles.panel}>
            <header className={styles.panelHeader}>
                <div className={styles.panelTaskHead}>
                    <span className={styles.taskNumber}>{`${board.prefix}-${task.number}`}</span>
                    <TypeBadge type={task.type} />
                </div>
                <h3 className={styles.panelTitle}>{task.title}</h3>
            </header>

            {task.description && (
                <p className={styles.panelDescription}>{task.description}</p>
            )}

            
            {task.sprint && (
                <Form.Root className={styles.estimationRow} onSubmit={handleSubmit(handleApply)}>
                    <Field name="assignee" label={intl.formatMessage({ id: 'boards.taskAssignee' })} errors={errors} required>
                        <Select
                            register={register}
                            name="assignee"
                            defaultValue={task.assignee}
                            items={board.watchersData}
                            nameKey="watcherName"
                            valueKey="watcherName"
                            validate={{
                                assigned: (value) => value !== 'unassigned' || intl.formatMessage({ id: 'boards.validation.assigneeRequired' })
                            }}>
                            <option value="unassigned"><FormattedMessage id="boards.unassigned" /></option>
                            <option value={board.owner.name}>{board.owner.name}</option>
                        </Select>
                    </Field>

                    <Field name="estimation" label={intl.formatMessage({ id: 'boards.taskEstimation' })} errors={errors} required>
                        <Input
                            register={register}
                            name="estimation"
                            placeholder="0d 0h 0m"
                            errors={errors}
                            defaultValue={task.estimation || ''}
                            required={{
                                value: true,
                                message: intl.formatMessage({ id: 'boards.validation.estimationRequired' })
                            }}
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

                    <Button type="submit">
                        <FormattedMessage id="boards.planning.apply" />
                    </Button>
                </Form.Root>
            )}

            {isSessionForThisTask ? (
                <>
                    <PokerDeck myVote={myVote} revealed={planning.revealed} onVote={onVote} />
                    <VotesPanel
                        key={`${task.id}-${planning.revealed}`}
                        participants={participants}
                        votes={planning.votes || []}
                        revealed={planning.revealed}
                        isOwner={isOwner}
                        onReveal={onReveal}
                    />
                </>
            ) : isOwner ? (
                task.sprint && (
                    <Button variation="secondary" onClick={() => onStartEstimation(task.id)}>
                        <FormattedMessage id="boards.planning.startEstimation" />
                    </Button>
                )
            ) : (
                <p className={styles.waiting}>
                    <FormattedMessage id="boards.planning.waitingForFacilitator" />
                </p>
            )}
        </div>
    );
};

export default PlanningTaskPanel;
