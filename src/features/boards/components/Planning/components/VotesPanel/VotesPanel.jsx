import { FormattedMessage } from 'react-intl';
import Button from '@components/Button/Button';
import styles from './VotesPanel.module.scss';

const VotesPanel = ({ participants, votes, revealed, isOwner, onReveal }) => {
    const votesByEmail = new Map(votes.map(vote => [vote.email, vote]));
    const strayVotes = votes.filter(vote => !participants.some(participant => participant.email === vote.email));

    const renderValue = (vote) => {
        if (!vote) return <span className={styles.voteStatusWaiting}>—</span>;
        return <span className={styles.voteValue}>{vote.value}</span>;
    };

    return (
        <div className={styles.votes}>
            <div className={styles.voteList}>
                {participants.map(participant => {
                    const vote = votesByEmail.get(participant.email);
                    return (
                        <div key={participant.email} className={styles.voteRow}>
                            <span>{participant.name}</span>
                            {revealed ? renderValue(vote) : (
                                vote
                                    ? <span className={styles.voteStatusVoted}><FormattedMessage id="boards.planning.voted" /></span>
                                    : <span className={styles.voteStatusWaiting}><FormattedMessage id="boards.planning.waiting" /></span>
                            )}
                        </div>
                    );
                })}

                {revealed && strayVotes.map(vote => (
                    <div key={vote.email} className={styles.voteRow}>
                        <span>{vote.name}</span>
                        {renderValue(vote)}
                    </div>
                ))}
            </div>

            {isOwner && !revealed && (
                <div className={styles.controlButtons}>
                    <Button type="button" size="small" disabled={votes.length === 0} onClick={onReveal}>
                        <FormattedMessage id="boards.planning.reveal" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VotesPanel;
