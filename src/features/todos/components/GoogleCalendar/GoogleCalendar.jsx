import { FormattedMessage } from 'react-intl';
import useGoogleCalendar from '@features/todos/hooks/useGoogleCalendar';
import Loader from '@components/Loader/Loader';
import styles from './GoogleCalendar.module.scss';

const GoogleCalendar = () => {
    const { events, loading, error, isGoogleUser } = useGoogleCalendar();

    if (!isGoogleUser) {
        return null;
    }

    if (loading) {
        return (
            <div className={styles.googleCalendar}>
                <Loader className={styles.loader} />
            </div>
        );
    }

    if (error) {
        const errorMessageId = error.includes('API_NOT_ENABLED')
            ? 'googleCalendar.apiNotEnabled'
            : 'googleCalendar.error';

        return (
            <div className={styles.googleCalendar}>
                <p className={styles.error}>
                    <FormattedMessage id={errorMessageId} />
                </p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className={styles.googleCalendar}>
                <p className={styles.noEvents}>
                    <FormattedMessage id="googleCalendar.noEvents" />
                </p>
            </div>
        );
    }

    return (
        <div className={styles.googleCalendar}>
            <h3 className={styles.heading}>
                <FormattedMessage id="googleCalendar.title" />
            </h3>
            <ul className={styles.eventList}>
                {events.map((event) => (
                    <li key={event.id} className={styles.eventItem}>
                        <div className={styles.eventTime}>{event.timeRange}</div>
                        
                        {event.meetLink && (
                            <a
                                href={event.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.meetLink}
                            >
                                <FormattedMessage id="googleCalendar.joinMeet" />
                            </a>
                        )}

                        <div className={styles.eventDetails}>
                            <div className={styles.eventName}>{event.summary}</div>
                            {event.location && (
                                <div className={styles.eventLocation}>
                                    📍 {event.location}
                                </div>
                            )}
                            {event.description && (
                                <div className={styles.eventDescription}>
                                    {event.description}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoogleCalendar;
