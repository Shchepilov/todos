import { useRef, useState } from "react";
import { useStore } from "@store/store";
import { useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from "react-hook-form"
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import { addBoard } from "@features/boards/services/boardsQuery";

const BoardForm = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const user = useStore((state) => state.user);
    const closeDialogRef = useRef(null);
    
    const navigate = useNavigate();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddBoard = async (data) => {
        const { boardName } = data;

        const newBoardId = await addBoard(user.uid, boardName, { email: user.providerData[0].email , name: user.providerData[0].displayName });

        closeDialog();

        if (newBoardId) {
            navigate(`/boards/${newBoardId}`);
        }
    };

    return (
        <Form.Root onSubmit={handleSubmit(handleAddBoard)} className="form" id="boardSettingForm">
            <Field name="boardName" label="Board Name" errors={errors}>
                <Input
                    register={register}
                    name="boardName"
                    placeholder="Board Name"
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
                <Button type="submit"><PlusIcon/>Add Board</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
     );
}
 
export default BoardForm;
