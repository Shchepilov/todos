import dayjs from 'dayjs';

export const fetchEventsForDay = async (accessToken, date) => {
    if (!accessToken || !date) {
        throw new Error('Access token and date are required');
    }

    const startOfDay = dayjs(date).startOf('day').toISOString();
    const endOfDay = dayjs(date).endOf('day').toISOString();

    const params = new URLSearchParams({
        timeMin: startOfDay,
        timeMax: endOfDay,
        singleEvents: 'true',
        orderBy: 'startTime',
    });

    const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('TOKEN_EXPIRED');
        }
        if (response.status === 403) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Google Calendar API 403 Error:', errorData);
            throw new Error('API_NOT_ENABLED');
        }
        if (response.status === 404) {
            throw new Error('Calendar not found');
        }
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    return (data.items || []).map(event => ({
        id: event.id,
        summary: event.summary || 'Untitled Event',
        time: formatEventTime(event),
        timeRange: formatEventTimeRange(event),
        start: event.start,
        end: event.end,
        location: event.location || null,
        description: event.description || null,
        meetLink: event.hangoutLink || null,
        htmlLink: event.htmlLink || null,
    }));
};

export const formatEventTime = (event) => {
    if (event.start.dateTime) {
        return dayjs(event.start.dateTime).format('h:mm A');
    }

    if (event.start.date) {
        return 'All day';
    }

    return 'No time';
};

export const formatEventTimeRange = (event) => {
    if (event.start.dateTime && event.end.dateTime) {
        const start = dayjs(event.start.dateTime);
        const end = dayjs(event.end.dateTime);
        return `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
    }

    if (event.start.date) {
        return 'All day';
    }

    return 'No time';
};
