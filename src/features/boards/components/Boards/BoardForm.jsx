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
import { useIntl, FormattedMessage } from 'react-intl';

const BoardForm = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const intl = useIntl();
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
                <Field name="boardName" label={intl.formatMessage({ id: "boards.boardName" })} required errors={errors}>
                    <Input
                        register={register}
                        name="boardName"
                        placeholder={intl.formatMessage({ id: "boards.boardName" })}
                        autoFocus
                        errors={errors}
                        required={intl.formatMessage({ id: "common.required" })}
                        maxLength={{
                            value: 20,
                            message: intl.formatMessage({ id: "boards.validation.boardNameMaxLength" }, { length: 20 })
                        }}
                    />
                </Field>

                <Field name="boardPrefix" label={intl.formatMessage({ id: "boards.boardPrefix" })} required errors={errors} className={styles.boardPrefix}>
                    <Input
                        register={register}
                        name="boardPrefix"
                        onChange={handlePrefixChange}
                        placeholder={intl.formatMessage({ id: "boards.boardPrefix" })}
                        errors={errors}
                        required={intl.formatMessage({ id: "boards.validation.boardPrefixRequired" })}
                        pattern={{
                            value: /^[A-Z]{1,5}$/,
                            message: intl.formatMessage({ id: "boards.validation.boardPrefixPattern" })
                        }}
                        maxLength={{
                            value: 5,
                            message: intl.formatMessage({ id: "boards.validation.boardPrefixMaxLength" }, { length: 5 })
                        }}
                    />
                </Field>
            </Row>

            <Row equal>
                <Button type="button" variation="secondary" onClick={closeDialog}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                
                <Button type="submit">
                    <PlusIcon/>
                    <FormattedMessage id="common.add" />
                </Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
     );
}
 
export default BoardForm;
