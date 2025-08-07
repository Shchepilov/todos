import { useEffect } from "react";
import { useStore } from "@store/store";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import dayjs from 'dayjs';
import Calendar from "react-calendar";
import useTodos from "@features/todos/hooks/useTodos";
import "react-calendar/dist/Calendar.css";
import "./TodoCalendar.scss";

const TodoCalendar = () => {
    const { loading, error } = useTodos();
    const currentDay = useStore((state) => state.currentDay);
    const setCurrentDay = useStore((state) => state.setCurrentDay);
    const allTodos = useStore((state) => state.allTodos);
    const locale = useStore((state) => state.locale);
    const uniqueDates = [...new Set(allTodos.map((item) => item.date))];
    const currentDate = dayjs(new Date()).format('YYYY-MM-DD');

    useEffect(() => {
        setCurrentDay(currentDate);
    }, [currentDate]);

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = dayjs(date).format('YYYY-MM-DD');

            const todosForDate = allTodos.filter(todo => todo.date === dateString);
            const allTodosDone = todosForDate.length > 0 && todosForDate.every(todo => todo.done);

            if (allTodosDone) return 'has-todos all-done';

            if (uniqueDates.includes(dateString)) return `has-todos`;
        }
    };

    const handleDayClick = (value) => {
        const date = dayjs(value).format('YYYY-MM-DD');
        setCurrentDay(date);
    };

    return (
        <Calendar
            value={currentDay}
            onChange={handleDayClick}
            tileClassName={getTileClassName}
            next2Label={null}
            prev2Label={null}
            locale={locale}
            prevLabel={<ChevronLeftIcon />}
            nextLabel={<ChevronRightIcon />}
        />
    );
};

export default TodoCalendar;
