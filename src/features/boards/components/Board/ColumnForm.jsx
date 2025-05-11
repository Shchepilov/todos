import { useRef, useState } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";

const ColumnForm = ({ boardId }) => {
    const addColumn = useStore((state) => state.addColumn);
    const [columnName, setColumnName] = useState("");
    const closeDialogRef = useRef(null);
    
    const setColumnNameValue = (e) => {
        setColumnName(e.target.value);
    }
    
    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddColumn = (e) => {
        e.preventDefault();
        if (!columnName) return;

        addColumn(boardId, columnName);
        setColumnName("");
        closeDialog();
    }

    return (
        <form onSubmit={handleAddColumn} className="form">
            <input type="text" autoFocus onChange={setColumnNameValue} placeholder="Column name"/>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!columnName}><PlusIcon/>Add Column</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
}
 
export default ColumnForm;
