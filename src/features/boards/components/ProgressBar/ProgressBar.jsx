import { calculateProgress, calculateRemainingTime } from "@features/boards/utils/helpers";
import styles from './ProgressBar.module.scss';

const ProgressBar = ({ estimation, loggedTime }) => {
    const progress = calculateProgress(estimation, loggedTime);
    const remainingTime = calculateRemainingTime(estimation, loggedTime);
    
    return (
        <div className={styles.progressWrapper}>
            {estimation && <span className={styles.estimationTime}>estimation {estimation}</span>}

            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress.toFixed(2)}%` }}/>
            </div>

            <span className={styles.loggedTime}>logged {loggedTime}</span>

            <span className={styles.remainingTime}>{remainingTime}</span>
        </div>
    );
};

export default ProgressBar;
