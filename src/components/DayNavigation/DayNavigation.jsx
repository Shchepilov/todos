import { useStore } from "../../store/store";
import dayjs from "dayjs";
import styles from "./DayNavigation.module.css";

const DayNavigation = () => {
    const currentDay = useStore((state) => state.currentDay);
    const setCurrentDay = useStore((state) => state.setCurrentDay);

    const handlePrevDay = () => {
        setCurrentDay(dayjs(currentDay).subtract(1, 'day'));
    }

    const handleNextDay = () => {
        setCurrentDay(dayjs(currentDay).add(1, 'day'));
    }

    const handleToday = () => {
        setCurrentDay(dayjs());
    }

    return ( 
        <div className={styles.container}>
            <h2 className={styles.title}>Today: {dayjs(currentDay).format('YYYY-MM-DD')}</h2>
            <div className={styles.buttons}>
                <button onClick={handlePrevDay}>Previous Day</button>
                <button onClick={handleToday}>Today</button>
                <button onClick={handleNextDay}>Next Day</button>
            </div>
        </div>        
    );
}
 
export default DayNavigation;
