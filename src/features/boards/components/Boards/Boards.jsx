import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useStore } from "@store/store";
import Board from "../Board/Board";
import BoardForm from './BoardForm';
import styles from './Boards.module.scss';
import Button from '@components/Button/Button';
import Modal from "@components/Modal/Modal";
import { PlusIcon } from '@radix-ui/react-icons';
import useBoards from '@features/boards/hooks/useBoards';

const Boards = () => {
    const [boardFormModal, setBoardFormModal] = useState(false);
    const [sliderStyle, setSliderStyle] = useState({});
    const activeBoardId = useStore((state) => state.activeBoardId);
    const setActiveBoardId = useStore((state) => state.setActiveBoardId);
    const [boardLink, setBoardLink] = useState('');
    const navRef = useRef(null);
    const navWrapper = useRef(null);
    const location = useLocation();
    const boards = useStore((state) => state.boards);

    const { loading, error, watchLoading, watchError } = useBoards();

    const showBoardForm = () => setBoardFormModal(true);

    const scrollNavigation = (item) => {
        if (!navWrapper.current) return;
        
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        const viewportCenter = navWrapper.current.offsetWidth / 2;
        const newScrollPosition = itemCenter - viewportCenter;
        
        navWrapper.current.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
        });
    }

    const handleNavItemClick = (e) => {
        const clickedItem = e.currentTarget;
        scrollNavigation(clickedItem);
    };    
    
    useEffect(() => {
        if(!boards || boards.length === 0) return;
        if (!navRef.current) return;

        const activeLink = navRef.current.querySelector(`.${styles.active}`);
        if (activeLink) {
            const updateSlider = () => {
                const { offsetLeft, offsetWidth } = activeLink;
                const boardId = activeLink.href.split('/').pop();

                setBoardLink(boardId);
                setSliderStyle({ left: offsetLeft, width: offsetWidth });
                scrollNavigation(activeLink);
            };

            document.fonts.ready.then(updateSlider);
        }

    }, [location, boards]);

    useEffect(() => {
        if (!boards || boards.length === 0) return;
        
        const pathSegments = location.pathname.split('/');
        const currentBoardId = pathSegments[pathSegments.length - 1];
        
        if (currentBoardId &&  boards.some(board => board.id === currentBoardId) && activeBoardId !== currentBoardId) {
            setActiveBoardId(currentBoardId);
        }
    }, [location, boards]);

    return (  
        <div className={styles.layout}>
            <section className={styles.boardNav}>
                {boards.length > 0 && (
                    <div ref={navWrapper} className={styles.navWrapper}>
                        <nav ref={navRef} className={styles.nav}>
                            <span className={styles.slider} data-page={boardLink} style={{ ...sliderStyle }}/>
                            {boards.map((board) => (
                                <NavLink key={board.id} 
                                    to={`/boards/${board.id}`} 
                                    onClick={handleNavItemClick}
                                    className={({isActive}) => (isActive ? styles.active : null)}>
                                    {board.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                )}

                <Button variation="icon" size="small" onClick={showBoardForm} className={styles.addButton}>
                    <PlusIcon />
                </Button>
            </section>
            
            <Routes>
                <Route path="/" element={
                    boards && boards.length > 0 
                        ? <Navigate to={`/boards/${activeBoardId ? activeBoardId : boards.at(-1).id}`} replace />
                        : null
                } />
                <Route path="/:boardId/*" element={<Board />} />
            </Routes>

            <Modal heading='+ Add Board' isDialogOpen={boardFormModal} setIsDialogOpen={setBoardFormModal}>
                <BoardForm />
            </Modal>
        </div>
    );
}
 
export default Boards;
