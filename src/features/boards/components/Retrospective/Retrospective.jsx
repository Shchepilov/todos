import RetrospectiveColumn from './RetrospectiveColumn';
import styles from './Retrospective.module.scss';
import { RETROSPECTIVE_TYPES } from '@features/boards/utils/constants';

const Retrospective = () => {
    return (
        <div className={styles.content}>
            {RETROSPECTIVE_TYPES.map(type => (
                <RetrospectiveColumn key={type} type={type} />
            ))}
        </div>
    );
}

export default Retrospective;
