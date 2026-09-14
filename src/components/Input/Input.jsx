import { cn } from 'cn';
import styles from './Input.module.scss';

const Input = ({ register, type, name, placeholder, autoFocus, className, errors, defaultValue, ...registerOptions }) => {
    return (
        <input
            {...register(name, registerOptions)}
            type={type}
            defaultValue={defaultValue}
            className={cn(errors[name] && styles.invalid, styles.input, className)}
            autoFocus={autoFocus}
            placeholder={placeholder}
        />
    );
};

export default Input;
