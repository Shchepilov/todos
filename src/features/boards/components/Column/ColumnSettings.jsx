import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '@components/Button/Button';
import { updateColumn } from '@features/boards/services/columnsQuery';

const ColumnSettings = ({column}) => {
    const [columnTitle, setColumnTitle] = useState(column.name);
    const closeDialogRef = useRef(null);
    
    const closeDialog = () => closeDialogRef.current?.click();
    const handleColumnTitle = (e) => setColumnTitle(e.target.value);

    const handleUpdateColumn = (e) => {
        e.preventDefault();
        if (!columnTitle) return;
        
        updateColumn(column.id, { name: columnTitle });
        closeDialog();
    };

    return ( 
        <form onSubmit={handleUpdateColumn} className="form">
            <div className="field">
                <label className="label">Column title</label>
                <input type="text" autoFocus value={columnTitle} onChange={handleColumnTitle} />
            </div>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!columnTitle}>Save</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
}
 
export default ColumnSettings;
