import styles from './Select.module.scss';

const Select = ({ items, register, name, defaultValue, nameKey = 'name', valueKey = 'value', children }) => {
    return ( 
        <select defaultValue={defaultValue} {...register(name)} className={styles.select}>
            {children}
            {items.map((item, index) => (
                <option key={index} value={item[valueKey]}>{item[nameKey]}</option>
            ))}
        </select>
     );
}
 
export default Select;
