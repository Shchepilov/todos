import { useEffect, useRef } from "react";
import { useStore } from "@store/store";
import styles from './BoardForm.module.scss';

const BoardForm = () => {
    const addBoard = useStore((state) => state.addBoard);
    const fetchBoards = useStore((state) => state.fetchBoards);
    
    const nameRef = useRef();

    const handleAddBoard = () => {
        const name = nameRef.current.value;

        if (!name) return;

        addBoard(name);
        nameRef.current.value = "";
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    return ( 
        <>
            <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                <input  type="text"  ref={nameRef}  placeholder="New board name"/>
                <button onClick={handleAddBoard}>Create Board</button>
            </form>
        </>
     );
}
 
export default BoardForm;