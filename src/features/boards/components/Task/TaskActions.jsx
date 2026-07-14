import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Button from "@components/Button/Button";
import ConfirmationModal from "@components/ConfirmationModal/ConfirmationModal";
import { deleteTask } from '@features/boards/services/tasksQuery';

const TaskActions = ({ task, isWatcher, className }) => {
    const intl = useIntl();
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

    const handleDeleteTask = () => deleteTask(task.id);

    if (isWatcher) return null;

    return (
        <>
            <Button
                variation="transparent"
                className={className}
                size="small"
                onClick={() => setDeleteConfirmModal(true)}
                aria-label={intl.formatMessage({ id: 'boards.deleteTaskAriaLabel' })}>
                <TrashIcon />
            </Button>

            <ConfirmationModal
                heading={intl.formatMessage({ id: 'boards.deleteTask' })}
                message={<FormattedMessage id="boards.deleteTaskConfirm" />}
                isDialogOpen={deleteConfirmModal}
                setIsDialogOpen={setDeleteConfirmModal}
                onConfirm={handleDeleteTask}
            />
        </>
    );
};

export default TaskActions;
