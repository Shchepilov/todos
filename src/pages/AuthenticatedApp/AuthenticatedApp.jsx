
import { Routes, Route, Navigate } from "react-router-dom";
import Todos from "@features/todos/components/Todos/Todos";
import Notes from "@features/notes/components/Notes/Notes";
import Tasks from "@features/tasks/components/Tasks/Tasks";
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
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </>
    );
};

export default AuthenticatedApp;
