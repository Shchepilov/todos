import { useRef } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from "react-hook-form"
import { PlusIcon } from "@radix-ui/react-icons";
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";

import { addColumn } from '@features/boards/services/columnsQuery';

const ColumnForm = ({ boardId }) => {
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
            <Field name="columnName" label="Column Name" errors={errors}>
                <Input
                    register={register}
                    name="columnName"
                    placeholder="Column Name"
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
                <Button type="submit"><PlusIcon/>Add Column</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
}
 
export default ColumnForm;
