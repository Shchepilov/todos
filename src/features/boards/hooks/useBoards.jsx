import { useEffect } from "react";
import { useStore } from "@store/store";
import { db } from "@baseUrl/firebase";
import { collection, orderBy, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

const useBoards = (options) => {
    const setBoards = useStore((state) => state.setBoards);
    const user = useStore((state) => state.user);
    const userEmail = user.providerData[0].email;

    const boardsQuery = query(
        collection(db, "boards"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "asc")
    );

    const watchBoardsQuery = query(
        collection(db, "boards"),
        where("watchers", "array-contains", userEmail),
        orderBy("timestamp", "asc")
    );
    
    const [snapshot, loading, error] = useCollection(boardsQuery, options);
    const [watchSnapshot, watchLoading, watchError] = useCollection(watchBoardsQuery, options);

    useEffect(() => {
        if (loading || watchLoading) return;
        const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        const watchBoards = watchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isWatcher: true }));
        const allBoards = [...boards, ...watchBoards];
        setBoards(allBoards);
        
    }, [snapshot, watchSnapshot]);

    return { loading, error, watchLoading, watchError };
}
 
export default useBoards;
