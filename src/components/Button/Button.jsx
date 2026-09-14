import { cn } from 'cn';
import styles from './Button.module.scss';

const Button = ({ children, variation = 'primary', size = 'medium', className = '', onClick, ...props }) => {
    return (
        <button className={cn(styles.button, styles[variation], styles[size], className)} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
