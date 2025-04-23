import styles from './Button.module.scss';

const Button = ({ children, variation = 'primary', size = 'medium', className = '', onClick, ...props }) => {
    const classList = [
        styles.button,
        styles[variation],
        styles[size],
        className
    ];

    const combinedClassName = classList.filter(Boolean).join(' ');

    return (
        <button className={combinedClassName} onClick={onClick} {...props} >
            {children}
        </button>
    );
};

export default Button;
