import { useState, useEffect } from 'react';
import { useStore } from '@store/store';
import { fetchEventsForDay } from '../services/googleCalendarService';
import dayjs from 'dayjs';

const useGoogleCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const user = useStore((state) => state.user);
    const googleAccessToken = useStore((state) => state.googleAccessToken);
    const currentDay = useStore((state) => state.currentDay);

    const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com';

    // Примітка: Автоматичне оновлення токену вимкнено, оскільки Firebase Auth
    // не надає refresh token для Google OAuth. Токени живуть 1 годину.
    // Користувач побачить дружнє повідомлення коли токен експірується.

    useEffect(() => {
        if (!isGoogleUser || !googleAccessToken) {
            setEvents([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const date = dayjs(currentDay).format('YYYY-MM-DD');
                const fetchedEvents = await fetchEventsForDay(googleAccessToken, date);
                setEvents(fetchedEvents);
            } catch (err) {
                if (err.message === 'TOKEN_EXPIRED') {
                    // Токен експірувався (після 1 години). Показати дружнє повідомлення.
                    setError('Your calendar access has expired. Please sign out and sign in again to refresh.');
                    setEvents([]);
                } else {
                    setError(err.message);
                    setEvents([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentDay, googleAccessToken, isGoogleUser]);

    return { events, loading, error, isGoogleUser };
};

export default useGoogleCalendar;
