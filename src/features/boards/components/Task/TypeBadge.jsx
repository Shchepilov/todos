import styles from './Task.module.scss';

const TypeBadge = ({ type, className = '' }) => {
    return ( 
        <span className={`${className} ${styles.typeBadge} ${styles[type]}`}>
            {type}
        </span>
    );
}

export default TypeBadge;
