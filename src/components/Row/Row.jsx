import styles from './Row.module.scss';

const Row = ({ children, gap = 'medium', align = 'start', justify = 'start', wrap = false, equal = false, className = '', ...props }) => {
    const gapClass = gap ? styles[`gap-${gap}`] : '';
    const alignClass = align ? styles[`align-${align}`] : '';
    const justifyClass = justify ? styles[`justify-${justify}`] : '';
    const wrapClass = wrap ? styles.wrap : '';
    const equalClass = equal ? styles.equal : '';

    return (
        <div className={`${styles.row} ${gapClass} ${alignClass} ${justifyClass} ${wrapClass} ${equalClass} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Row;
