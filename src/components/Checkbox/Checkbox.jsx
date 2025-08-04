import { useId } from 'react';
import styles from './Checkbox.module.scss';
import { CheckIcon } from '@radix-ui/react-icons';

const Checkbox = ({ label, checked = false, onChange, disabled = false, className = '' }) => {
    const fieldId = useId();

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <input
                type="checkbox"
                id={fieldId}
                className={styles.checkbox}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />

            <label htmlFor={fieldId} className={styles.label}>
                <span className={styles.checkmark}>
                    <CheckIcon />
                </span>

                {label && <span className={styles.labelText}>{label}</span>}
            </label>
        </div>
    );
};

export default Checkbox;
