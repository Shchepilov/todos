import { useEffect, useRef, useState } from "react";
import { useStore } from "@store/store";
import { useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";

const BoardForm = () => {
    const addBoard = useStore((state) => state.addBoard);
    const fetchBoards = useStore((state) => state.fetchBoards);
    const closeDialogRef = useRef(null);
    const [boardName, setBoardName] = useState("");
    const navigate = useNavigate();

    const setBoardNameValue = (e) => {
        setBoardName(e.target.value);
    }

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddBoard = async (e) => {
        e.preventDefault();
        if (!boardName) return;

        const newBoardId = await addBoard(boardName);
        setBoardName("");
        closeDialog();

        if (newBoardId) {
            navigate(`/boards/${newBoardId}`);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <form onSubmit={handleAddBoard} className="form">
            <input type="text" autoFocus onChange={setBoardNameValue} placeholder="Board name"/>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!boardName}><PlusIcon/>Add Board</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
     );
}
 
export default BoardForm;
