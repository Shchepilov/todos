import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import { updateColumn } from '@features/boards/services/columnsQuery';

const ColumnSettings = ({column}) => {
    const closeDialogRef = useRef(null);
    
    const closeDialog = () => closeDialogRef.current?.click();

    const handleUpdateColumn = (data) => {
        const { columnTitle } = data;

        updateColumn(column.id, { name: columnTitle });
        closeDialog();
    };

    const { register, handleSubmit, formState: { errors }, } = useForm();

    return ( 
        <Form.Root onSubmit={handleSubmit(handleUpdateColumn)} className="form">
            <Field name="columnTitle" label="Column title" errors={errors}>
                <Input
                    register={register}
                    defaultValue={column.name}
                    name="columnTitle"
                    placeholder="Column title"
                    autoFocus
                    errors={errors}
                    required="Field is required"
                    maxLength={{
                        value: 20,
                        message: "Title cannot exceed 20 characters"
                    }}
                />
            </Field>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
}
 
export default ColumnSettings;
