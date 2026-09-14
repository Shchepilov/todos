import { cn } from 'cn';
import styles from './Row.module.scss';

const Row = ({ children, gap = 'medium', align = 'start', justify = 'start', wrap = false, equal = false, className = '', ...props }) => {
    return (
        <div
            className={cn(
                styles.row,
                gap && styles[`gap-${gap}`],
                align && styles[`align-${align}`],
                justify && styles[`justify-${justify}`],
                wrap && styles.wrap,
                equal && styles.equal,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Row;
