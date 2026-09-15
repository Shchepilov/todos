import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { LEGACY_PLANNING_FIELDS } from '@features/boards/utils/constants';
dayjs.extend(duration);

export const parseTimeData = (str) => {
    if (!str) return dayjs.duration(0);

    const parts = str.split(' ');
    let days = 0, hours = 0, minutes = 0;
    
    parts.forEach(part => {
        if (part.endsWith('d')) {
            days = parseInt(part);
        } else if (part.endsWith('h')) {
            hours = parseInt(part);
        } else if (part.endsWith('m')) {
            minutes = parseInt(part);
        }
    });

    // Convert days to hours using 8-hour workdays
    const totalHours = (days * 8) + hours;

    return dayjs.duration({
        hours: totalHours,
        minutes: minutes
    });
};

export const calculateProgress = (estimation, loggedTime) => {
    const totalDuration = parseTimeData(estimation);
    const loggedDuration = parseTimeData(loggedTime);
    
    const progress = (loggedDuration.asMilliseconds() / totalDuration.asMilliseconds()) * 100;
    return Math.min(progress, 100);
};

export const calculateRemainingTime = (estimation, loggedTime) => {
    const totalDuration = parseTimeData(estimation);
    const loggedDuration = parseTimeData(loggedTime);
    const remaining = totalDuration.subtract(loggedDuration);
    
    if (remaining.asMilliseconds() == 0) {
        return "0m";
    }

    if (remaining.asMilliseconds() < 0) {
        const overTime = Math.abs(remaining.asMilliseconds());
        const overDuration = dayjs.duration(overTime);
        const days = Math.floor(overDuration.asHours() / 8); // 8 hours = 1 day
        const hours = Math.floor(overDuration.asHours() % 8);
        const minutes = Math.floor(overDuration.asMinutes() % 60);

        let result = [];
        if (days > 0) result.push(`${days}d`);
        if (hours > 0) result.push(`${hours}h`);
        if (minutes > 0) result.push(`${minutes}m`);

        return `over estimation ${result.join(' ')}`;
    }
    
    const days = Math.floor(remaining.asHours() / 8); // 8 hours = 1 day
    const hours = Math.floor(remaining.asHours() % 8);
    const minutes = Math.floor(remaining.asMinutes() % 60);
    
    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    
    return `remain ${result.join(' ')}`;
};

export const addLoggedTime = (loggedTime, newLoggedTime) => {
    const totalDuration = parseTimeData(loggedTime);
    const newDuration = parseTimeData(newLoggedTime);
    const updatedDuration = totalDuration.add(newDuration);
    
    const days = Math.floor(updatedDuration.asHours() / 8); // 8 hours = 1 day
    const hours = Math.floor(updatedDuration.asHours() % 8);
    const minutes = Math.floor(updatedDuration.asMinutes() % 60);
    
    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    
    return result.join(' ');
};

export const generateId = () => crypto.randomUUID();

export const taskNeedsPlanning = (task) => task.assignee === 'unassigned' || !task.estimation;

// A pre-sprint-scoped session sits directly under board.planning instead of board.planning[sprintId]
export const hasLegacyPlanning = (board) =>
    Boolean(board?.planning) && LEGACY_PLANNING_FIELDS.some(field => field in board.planning);

// Sessions started before votes became a map keyed by email still hold an array.
export const hasLegacyPlanningVotes = (planning) => Array.isArray(planning?.votes);

export const getPlanningVotes = (planning) => {
    if (hasLegacyPlanningVotes(planning)) return planning.votes;

    return Object.entries(planning?.votes ?? {}).map(([email, vote]) => ({ email, ...vote }));
};

// Before the move to board.retrospective, items were stored inside board.sprints[].retrospective
export const hasLegacyRetrospective = (board) =>
    Boolean(board?.sprints?.some(sprint => 'retrospective' in sprint));

// An entry without a message is left by a vote that raced with a delete, so it is skipped.
export const getRetrospectiveItems = (board, sprintId, type) =>
    Object.entries(board?.retrospective?.[sprintId]?.[type] ?? {})
        .filter(([, item]) => item.message)
        .map(([id, item]) => ({ ...item, id }))
        .sort((a, b) => a.createdAt - b.createdAt);

// Logged time is the sum of the work logs, so adding a log never rewrites a stored total.
export const getLoggedTime = (task) =>
    (task.workLogsList ?? []).reduce((total, log) => addLoggedTime(total, log.time), '');
