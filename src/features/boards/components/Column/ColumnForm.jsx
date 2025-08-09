import { useRef } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from "react-hook-form"
import { PlusIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";
import Row from '@components/Row/Row';

import { addColumn } from '@features/boards/services/columnsQuery';

const ColumnForm = ({ boardId }) => {
    const intl = useIntl();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const closeDialogRef = useRef(null);
    
    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddColumn = (data) => {
        const { columnName } = data;

        addColumn(boardId, columnName);
        closeDialog();
    }

    return (
        <Form.Root onSubmit={handleSubmit(handleAddColumn)} className="form">
            <Field name="columnName" label={intl.formatMessage({ id: 'common.title' })} required errors={errors}>
                <Input
                    register={register}
                    name="columnName"
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
                <Button type="button" variation="secondary" onClick={closeDialog}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                <Button type="submit">
                    <PlusIcon/>
                    <FormattedMessage id="boards.addColumn" />
                </Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
}
 
export default ColumnForm;
