import * as Form from '@radix-ui/react-form';
import styles from './Field.module.scss';

const Field = ({ name, label, errors, required, className='', children }) => {
    return (
        <Form.Field className={`${styles.field} ${className}`}>
            {label && <Form.Label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</Form.Label>}
            <Form.Control asChild>
                {children}
            </Form.Control>
            {errors[name] && <Form.Message className={styles.error}>{errors[name].message}</Form.Message>}
        </Form.Field>
    );
};

export default Field;
