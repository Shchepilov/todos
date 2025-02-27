import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useStore } from "@store/store";
import Board from "../Board/Board";
import BoardForm from '../BoardForm/BoardForm';
import styles from './Boards.module.scss';

const Boards = () => {
    const boards = useStore((state) => state.boards);

    return (  
        <div>
            <BoardForm />

            <h1>Boards</h1>
            <nav className={styles.nav}>
                {boards && boards.map((board) => (
                    <NavLink key={board.id} 
                          to={`/boards/${board.id}`} 
                          className={({isActive}) => (isActive ? styles.active : null)}>
                        {board.name}
                    </NavLink>
                ))}
            </nav>

            <Routes>
                <Route path="/" element={
                    boards && boards.length > 0 
                        ? <Navigate to={`/boards/${boards.at(-1).id}`} replace />
                        : null
                } />
                <Route path="/:boardId" element={<Board />} />
            </Routes>
        </div>
    );
}
 
export default Boards;