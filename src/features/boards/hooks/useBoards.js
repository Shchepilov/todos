import { useEffect } from "react";
import { useStore } from "@store/store";
import { useCollection } from 'react-firebase-hooks/firestore'

import { boardsQuery, watchBoardsQuery } from "@features/boards/services/boardsQuery";

const useBoards = (options) => {
    const setBoards = useStore((state) => state.setBoards);
    const user = useStore((state) => state.user);
    const userEmail = user.providerData[0].email;

    const allUserBoards = boardsQuery(user.uid);
    const allWatchBoards = watchBoardsQuery(userEmail);
    
    const [boardsSnapshot, loading, error] = useCollection(allUserBoards, options);
    const [boardsWatchSnapshot, watchLoading, watchError] = useCollection(allWatchBoards, options);

    useEffect(() => {
        if (!boardsSnapshot) return;
        const boards = boardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        const watchBoards = boardsWatchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isWatcher: true }));
        const allBoards = [...boards, ...watchBoards];
        setBoards(allBoards);
    }, [boardsSnapshot, boardsWatchSnapshot]);

    return { loading, error, watchLoading, watchError };
}
 
export default useBoards;
