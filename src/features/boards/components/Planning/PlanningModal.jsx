import { useState, useEffect } from 'react';
import { useStore } from '@store/store';
import { updateSprintPlanning } from '@features/boards/services/boardsQuery';
import { updateTask } from '@features/boards/services/tasksQuery';
import PlanningTaskList from '@features/boards/components/Planning/components/PlanningTaskList/PlanningTaskList';
import PlanningTaskPanel from '@features/boards/components/Planning/components/PlanningTaskPanel/PlanningTaskPanel';
import styles from './PlanningModal.module.scss';

const PlanningModal = ({ board, tasks, activeSprint }) => {
    const user = useStore((state) => state.user);
    const userEmail = user.providerData[0].email;
    const isOwner = !board.isWatcher;

    const userName = board.watchersData.find(watcher => watcher.watcherEmail === userEmail)?.watcherName
        || (board.owner.email === userEmail ? board.owner.name : userEmail.split('@')[0]);

    // Voting is scoped to a sprint, so members looking at another sprint are not pulled into it.
    const planning = (activeSprint && board.planning?.[activeSprint]) || null;

    const participants = [
        { email: board.owner.email, name: board.owner.name },
        ...board.watchersData.map(watcher => ({ email: watcher.watcherEmail, name: watcher.watcherName }))
    ];

    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const effectiveTaskId = isOwner
        ? (selectedTaskId || planning?.taskId || null)
        : (planning?.taskId || selectedTaskId || null);

    const currentTask = tasks.find(task => task.id === effectiveTaskId);

    // Owner cleanup: drop a stale planning session when its task left the sprint it belongs to.
    useEffect(() => {
        if (!isOwner || !planning) return;
        const roundTask = tasks.find(task => task.id === planning.taskId);
        if (!roundTask || roundTask.sprint !== activeSprint) {
            updateSprintPlanning(board.id, activeSprint, null);
        }
    }, [isOwner, planning, tasks, activeSprint, board.id]);

    const handleMoveToSprint = (taskId) => updateTask(taskId, { sprint: activeSprint });
    const handleMoveToBacklog = (taskId) => updateTask(taskId, { sprint: null });
    const handleApply = (taskId, updates) => {
        updateTask(taskId, updates);
        if (planning?.taskId === taskId) updateSprintPlanning(board.id, activeSprint, null);
        setSelectedTaskId(null);
    };

    const handleStartEstimation = (taskId) => {
        updateSprintPlanning(board.id, activeSprint, { taskId, revealed: false, votes: [] });
    };

    const handleVote = (value) => {
        if (!planning) return;
        const votes = [
            ...(planning.votes || []).filter(vote => vote.email !== userEmail),
            { email: userEmail, name: userName, value }
        ];
        updateSprintPlanning(board.id, activeSprint, { ...planning, votes });
    };

    const handleReveal = () => {
        if (!planning) return;
        updateSprintPlanning(board.id, activeSprint, { ...planning, revealed: true });
    };

    return (
        <div className={styles.content}>
            <PlanningTaskList
                tasks={tasks}
                board={board}
                activeSprint={activeSprint}
                activeTaskId={planning?.taskId || null}
                selectedTaskId={effectiveTaskId}
                onSelectTask={setSelectedTaskId}
                onMoveToSprint={handleMoveToSprint}
                onMoveToBacklog={handleMoveToBacklog}
            />

            <PlanningTaskPanel
                key={effectiveTaskId}
                taskId={effectiveTaskId}
                task={currentTask}
                board={board}
                planning={planning}
                isOwner={isOwner}
                userEmail={userEmail}
                participants={participants}
                onApply={handleApply}
                onStartEstimation={handleStartEstimation}
                onVote={handleVote}
                onReveal={handleReveal}
            />
        </div>
    );
};

export default PlanningModal;
