import { cn } from 'cn';
import styles from './Loader.module.scss';

const Loader = ({className}) => {
    return (
        <div className={cn(styles.loader, className)}></div>
    );
}
 
export default Loader;