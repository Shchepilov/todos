import { useEffect } from "react";
import { useStore } from "../../store/store";
import dayjs from 'dayjs';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TodoCalendar.css";

const TodoCalendar = () => {
    const currentDay = useStore((state) => state.currentDay);
    const setCurrentDay = useStore((state) => state.setCurrentDay);
    const allTodos = useStore((state) => state.allTodos);
    const fetchAllTodos = useStore((state) => state.fetchAllTodos);

    const uniqueDates = [...new Set(allTodos.map((item) => item.date))];

    useEffect(() => {
        fetchAllTodos();
    }, [currentDay]);

    const getTileClassName = ({ date, view }) => {
      if (view === 'month') {
        const dateString = dayjs(date).format('YYYY-MM-DD');

        if (uniqueDates.includes(dateString)) return `has-todos`;
      }
    };

    const handleDayClick = (value) => {
        const date = dayjs(value).format('YYYY-MM-DD');
        
        setCurrentDay(dayjs(date));
    };

    return (
        <Calendar
            value={currentDay}
            onChange={handleDayClick}
            tileClassName={getTileClassName}
            next2Label={null}
            prev2Label={null}
        />
    );
};

export default TodoCalendar;
