import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const parseTimeData = (str) => {
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

    return dayjs.duration({
        days: days,
        hours: hours,
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
        const days = Math.floor(overDuration.asDays());
        const hours = Math.floor(overDuration.asHours() % 24);
        const minutes = Math.floor(overDuration.asMinutes() % 60);

        let result = [];
        if (days > 0) result.push(`${days}d`);
        if (hours > 0) result.push(`${hours}h`);
        if (minutes > 0) result.push(`${minutes}m`);

        return `over estimation ${result.join(' ')}`;
    }
    
    const days = Math.floor(remaining.asDays());
    const hours = Math.floor(remaining.asHours() % 24);
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
    
    const days = Math.floor(updatedDuration.asDays());
    const hours = Math.floor(updatedDuration.asHours() % 24);
    const minutes = Math.floor(updatedDuration.asMinutes() % 60);
    
    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    
    return result.join(' ');
};
