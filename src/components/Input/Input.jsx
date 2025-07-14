import styles from './Input.module.scss';

const Input = ({ register, value, name, placeholder, autoFocus, className, errors, defaultValue, ...registerOptions }) => {
    return (
        <input
            {...register(name, registerOptions)}
            defaultValue={defaultValue}
            className={`${errors[name] ? styles.invalid : ''} ${styles.input} ${className || ''}`}
            autoFocus={autoFocus}
            placeholder={placeholder}
        />
    );
};

export default Input;
