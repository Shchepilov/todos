import Row from '@components/Row/Row';
import RetrospectiveColumn from './RetrospectiveColumn';
import styles from './Retrospective.module.scss';
import { RETROSPECTIVE_TYPES } from '@features/boards/utils/constants';

const Retrospective = () => {
    return (
        <Row equal align='stretch' className={styles.content}>
            {RETROSPECTIVE_TYPES.map(type => (
                <RetrospectiveColumn key={type} type={type} />
            ))}
        </Row>
    );
}

export default Retrospective;
