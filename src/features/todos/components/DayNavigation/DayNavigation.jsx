import { useStore } from "@store/store";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { FormattedMessage } from 'react-intl';
import dayjs from "dayjs";
import styles from "./DayNavigation.module.scss";

const DayNavigation = () => {
    const currentDay = useStore((state) => state.currentDay);
    const setCurrentDay = useStore((state) => state.setCurrentDay);
    const locale = useStore((state) => state.locale);

    dayjs.locale(locale);

    const handlePrevDay = () => {
        setCurrentDay(dayjs(currentDay).subtract(1, 'day'));
    }

    const handleNextDay = () => {
        setCurrentDay(dayjs(currentDay).add(1, 'day'));
    }

    const isToday = dayjs().format('YYYY-MM-DD') === dayjs(currentDay).format('YYYY-MM-DD');

    return ( 
        <div className={styles.container}>
            <button className={styles.button} onClick={handlePrevDay}>
                <ChevronLeftIcon />    
            </button>
            
            <div className={styles.title}>
                {dayjs(currentDay).format('D MMMM')}
                {isToday && <span>(<FormattedMessage id="common.today" />)</span>}</div>

            <button className={styles.button} onClick={handleNextDay}>
                <ChevronRightIcon />
            </button>
        </div>        
    );
}
 
export default DayNavigation;
