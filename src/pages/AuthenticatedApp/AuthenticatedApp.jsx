import { Routes, Route, Navigate } from "react-router-dom";
import Todos from "@features/todos/components/Todos/Todos";
import Notes from "@features/notes/components/Notes/Notes";
import Boards from '@features/boards/components/Boards/Boards';
import Header from "@layout/Header/Header";
import "@styles/global.scss";

const AuthenticatedApp = () => {
    return (
        <>
            <Header/>

            <Routes>
                <Route path="/" element={<Navigate to="/todos" />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/boards/*" element={<Boards />} />
            </Routes>
        </>
    );
};

export default AuthenticatedApp;
