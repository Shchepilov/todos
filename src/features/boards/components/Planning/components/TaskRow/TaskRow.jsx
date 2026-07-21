import { FormattedMessage } from 'react-intl';
import Button from '@components/Button/Button';
import taskStyles from '@features/boards/components/Task/Task.module.scss';
import TypeBadge from "@features/boards/components/Task/TypeBadge";
import styles from './TaskRow.module.scss';
import { ArrowRightIcon } from "@radix-ui/react-icons";

const TaskRow = ({ task, board, isActive, isEstimating, onSelect, onMove }) => (
    <li className={taskStyles.item + ' ' + styles.taskCard}
        data-priority={task.priority}
        onClick={() => onSelect(task.id)}
        data-active={isActive || undefined}>

        <header className={styles.header}>
            <span className={styles.title}>{`${board.prefix}-${task.number}`}</span>
            <TypeBadge type={task.type} />

            {task.sprint && isEstimating && (
                <span className={styles.voting} >
                    <FormattedMessage id="boards.planning.votingNow" />
                </span>
            )}
        </header>

        <span className={styles.title}>{task.title}</span>

        <Button
            size="small"
            variation="secondary"
            className={styles.moveButton}
            onClick={(e) => { e.stopPropagation(); onMove(task.id); }}>
            <FormattedMessage id={task.sprint ? 'boards.planning.moveToBacklog' : 'boards.planning.moveToSprint'} />
            <ArrowRightIcon width={16} height={16} />
        </Button>
    </li>
);

export default TaskRow;
