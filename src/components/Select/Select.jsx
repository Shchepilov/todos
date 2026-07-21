import styles from './Select.module.scss';

const Select = ({ items, register, name, value, defaultValue, nameKey = 'name', valueKey = 'value', onChange, className, children, ...registerOptions }) => {
    const registration = register ? register(name, registerOptions) : {};

    const handleChange = (event) => {
        registration.onChange?.(event);
        onChange?.(event);
    };

    return (
        <select defaultValue={defaultValue}
                {...registration}
                onChange={handleChange}
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
