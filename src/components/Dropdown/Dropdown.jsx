import styles from './Dropdown.module.scss';

const Dropdown = ({children}) => {
    return (  
        <div className={styles.dropdown}>{children}</div>
    );
}
 
export default Dropdown;
