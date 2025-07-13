import styles from './Input.module.scss';

const Input = ({ register, name, placeholder, autoFocus, className, errors, ...registerOptions }) => {
    return (
        <input
            {...register(name, registerOptions)}
            className={`${errors[name] ? styles.invalid : ''} ${styles.input} ${className || ''}`}
            autoFocus={autoFocus}
            placeholder={placeholder}
        />
    );
};

export default Input;
