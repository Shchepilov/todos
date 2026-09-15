import { useEffect } from "react";
import { useStore } from "@store/store";
import { useAuthUser } from "@baseUrl/auth/useAuthUser";
import { useCollection } from 'react-firebase-hooks/firestore'
import { boardsQuery, watchBoardsQuery } from "@features/boards/services/boardsQuery";

const useBoards = (options) => {
    const setBoards = useStore((state) => state.setBoards);
    const user = useAuthUser();
    const userEmail = user.providerData[0].email;

    const allUserBoards = boardsQuery(user.uid);
    const allWatchBoards = watchBoardsQuery(userEmail);
    
    const [boardsSnapshot, loading, error] = useCollection(allUserBoards, options);
    const [boardsWatchSnapshot, watchLoading, watchError] = useCollection(allWatchBoards, options);

    // Wait for both queries, so boards you watch are never missing for a moment (Board would redirect away).
    // A failed query (missing index, denied by rules) counts as empty. If both fail, the stored list is kept.
    useEffect(() => {
        if (loading || watchLoading || (!boardsSnapshot && !boardsWatchSnapshot)) return;
        const boards = boardsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data()})) ?? [];
        const watchBoards = boardsWatchSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data(), isWatcher: true })) ?? [];
        const allBoards = [...boards, ...watchBoards];
        setBoards(allBoards);
    }, [loading, watchLoading, boardsSnapshot, boardsWatchSnapshot, setBoards]);

    return { loading, error, watchLoading, watchError };
}
 
export default useBoards;
