import { useRef } from "react";
import { useStore } from "@store/store";
import { useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useForm } from "react-hook-form"
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Row from "@components/Row/Row";
import { addBoard } from "@features/boards/services/boardsQuery";
import styles from './Boards.module.scss';
const BoardForm = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const user = useStore((state) => state.user);
    const closeDialogRef = useRef(null);
    
    const navigate = useNavigate();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddBoard = async (data) => {
        const { boardName, boardPrefix } = data;

        const newBoardId = await addBoard(
            user.uid, 
            boardName, 
            boardPrefix,
            { 
                email: user.providerData[0].email,
                name: user.providerData[0].displayName 
            }
        );

        closeDialog();

        if (newBoardId) {
            navigate(`/boards/${newBoardId}`);
        }
    };

    const handlePrefixChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 5);
        e.target.value = value;
    };

    return (
        <Form.Root onSubmit={handleSubmit(handleAddBoard)} className="form" id="boardSettingForm">
            <Row equal>
                <Field name="boardName" label="Name" required errors={errors}>
                    <Input
                        register={register}
                        name="boardName"
                        placeholder="Name"
                        autoFocus
                        errors={errors}
                        required="Field is required"
                        maxLength={{
                            value: 20,
                            message: "Title cannot exceed 20 characters"
                        }}
                    />
                </Field>

                <Field name="boardPrefix" label="Prefix" required errors={errors} className={styles.boardPrefix}>
                    <Input
                        register={register}
                        name="boardPrefix"
                        onChange={handlePrefixChange}
                        placeholder="Prefix"
                        errors={errors}
                        required="Field is required"
                        pattern={{
                            value: /^[A-Z]{1,5}$/,
                            message: "Only letters"
                        }}
                        maxLength={{
                            value: 5,
                            message: "Max 5 characters"
                        }}
                    />
                </Field>
            </Row>

            <Row equal>
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit"><PlusIcon/>Add Board</Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
     );
}
 
export default BoardForm;
