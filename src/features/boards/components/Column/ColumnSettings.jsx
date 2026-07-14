import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import { useIntl, FormattedMessage } from 'react-intl';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import Row from '@components/Row/Row';
import { updateColumn } from '@features/boards/services/columnsQuery';

const ColumnSettings = ({column, onClose}) => {
    const intl = useIntl();

    const handleUpdateColumn = (data) => {
        const { columnTitle } = data;

        updateColumn(column.id, { name: columnTitle });
        onClose();
    };

    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <Form.Root onSubmit={handleSubmit(handleUpdateColumn)} className="form">
            <Field name="columnTitle" label={intl.formatMessage({ id: 'common.title' })} required errors={errors}>
                <Input
                    register={register}
                    defaultValue={column.name}
                    name="columnTitle"
                    placeholder={intl.formatMessage({ id: 'common.title' })}
                    autoFocus
                    errors={errors}
                    required={intl.formatMessage({ id: 'common.validation.titleRequired' })}
                    maxLength={{
                        value: 20,
                        message: intl.formatMessage({ id: 'boards.validation.titleMaxLength' }, { length: 20 })
                    }}
                />
            </Field>

            <Row equal>
                <Button type="button" variation="secondary" onClick={onClose}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                <Button type="submit">
                    <FormattedMessage id="common.save" />
                </Button>
            </Row>
        </Form.Root>
    );
}
 
export default ColumnSettings;
