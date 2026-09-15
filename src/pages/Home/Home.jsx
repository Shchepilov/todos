import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Todos from "@features/todos/components/Todos/Todos";
import Notes from "@features/notes/components/Notes/Notes";
import Boards from '@features/boards/components/Boards/Boards';
import Header from "@layout/Header/Header";
import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import "@styles/global.scss";

const Home = () => {
    const { pathname } = useLocation();

    return (
        <>
            <Header/>

            {/* The header stays outside, so after an error the user can still switch pages. */}
            <ErrorBoundary resetKey={pathname}>
                <Routes>
                    <Route path="/" element={<Navigate to="/todos" />} />
                    <Route path="/todos" element={<Todos />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/boards/*" element={<Boards />} />
                </Routes>
            </ErrorBoundary>
        </>
    );
};

export default Home;
