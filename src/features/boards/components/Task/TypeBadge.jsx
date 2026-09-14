import { cn } from 'cn';
import styles from './Task.module.scss';

const TypeBadge = ({ type, className = '' }) => {
    return (
        <span className={cn(styles.typeBadge, styles[type], className)}>
            {type}
        </span>
    );
}

export default TypeBadge;
