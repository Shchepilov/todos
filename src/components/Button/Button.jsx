import styles from './Button.module.scss';

const Button = ({ children, variation='button', size='medium', className='', onClick, ...props }) => {
    const classes = `${variation === 'icon' && styles.buttonIcon } ${ className } ${styles[size]}`;
    return (
      <button className={classes} onClick={onClick} {...props}>
        {children}
      </button>
    );
  };

export default Button;
