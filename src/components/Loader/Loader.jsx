import styles from './Loader.module.scss';

const Loader = ({className}) => {
    return ( 
        <div className={`${styles.loader} ${className}`}></div>
    );
}
 
export default Loader;