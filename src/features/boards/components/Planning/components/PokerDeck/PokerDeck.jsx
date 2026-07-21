import { PLANNING_DECK } from '@features/boards/utils/constants';
import styles from './PokerDeck.module.scss';

const PokerDeck = ({ myVote, revealed, onVote }) => (
    <div className={styles.deck}>
        {PLANNING_DECK.map(value => (
            <button
                key={value}
                type="button"
                disabled={revealed}
                className={`${styles.card} ${myVote === value ? styles.cardSelected : ''}`}
                onClick={() => onVote(value)}>
                {value}
            </button>
        ))}
    </div>
);

export default PokerDeck;
