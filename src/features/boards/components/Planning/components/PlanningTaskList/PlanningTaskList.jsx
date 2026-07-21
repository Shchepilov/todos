import { FormattedMessage } from 'react-intl';
import { taskNeedsPlanning } from '@features/boards/utils/helpers';
import TaskRow from '@features/boards/components/Planning/components/TaskRow/TaskRow';
import styles from './PlanningTaskList.module.scss';

const PlanningTaskList = ({ tasks, board, activeSprint, activeTaskId, selectedTaskId, onSelectTask, onMoveToSprint, onMoveToBacklog }) => {
    const needsAttention = tasks.filter(task => task.sprint === activeSprint && taskNeedsPlanning(task));
    const backlog = tasks.filter(task => !task.sprint);
    const activeSprintName = board.sprints?.find(sprint => sprint.id === activeSprint)?.name;

    return (
        <div className={styles.taskList}>
            <section className={styles.section}>
                <h4 className={styles.sectionTitle}>
                    {activeSprintName}
                </h4>

                {needsAttention.length === 0 ? (
                    <p className={styles.emptyState}>
                        <FormattedMessage id="boards.planning.allPlanned" />
                    </p>
                ) : (
                    <ul className={styles.list}>
                        {needsAttention.map(task => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                board={board}
                                isActive={task.id === selectedTaskId}
                                isEstimating={task.id === activeTaskId}
                                onSelect={onSelectTask}
                                onMove={onMoveToBacklog}
                            />
                        ))}
                    </ul>
                )}
            </section>

            <section className={styles.section}>
                <h4 className={styles.sectionTitle}>
                    <FormattedMessage id="boards.planning.backlog" />
                </h4>

                {backlog.length === 0 ? (
                    <p className={styles.emptyState}>
                        <FormattedMessage id="boards.planning.emptyBacklog" />
                    </p>
                ) : (
                    <ul className={styles.list}>
                        {backlog.map(task => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                board={board}
                                isActive={task.id === selectedTaskId}
                                isEstimating={task.id === activeTaskId}
                                onSelect={onSelectTask}
                                onMove={onMoveToSprint}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default PlanningTaskList;
