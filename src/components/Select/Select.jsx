import styles from './Select.module.scss';

const Select = ({ items, register, name, value, defaultValue, nameKey = 'name', valueKey = 'value', onChange, className, children }) => {
    return ( 
        <select defaultValue={defaultValue} 
                {...(register ? register(name) : {})} 
                onChange={onChange}
                value={value}
                name={name}
                className={`${styles.select} ${className || ''}`}>
            {children}
            {items.map((item, index) => (
                <option key={index} value={item[valueKey]}>{item[nameKey]}</option>
            ))}
        </select>
     );
}
 
export default Select;
