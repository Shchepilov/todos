import TaskColumn from '../TaskColumn/TaskColumn';
import styles from './TaskBoard.module.scss';

const TaskBoard = ({ columns }) => {
    const taskData = [
        { id: "1", title: "Fix Login Bug", description: "Resolve the error that prevents users from logging in.", priority: "Major", status: "open", estimate: "1h 30m", estimateConfirmed: true, dueDate: "2023-12-01", dueDateConfirmed: false, workLog: "0h 45m", workLogConfirmed: false },
        { id: "2", title: "Design New Dashboard", description: "Create a responsive and user-friendly admin dashboard design.", priority: "Critical", status: "backlog", estimate: "3h 00m", estimateConfirmed: false, dueDate: "2023-12-05", dueDateConfirmed: true, workLog: "1h 15m", workLogConfirmed: false },
        { id: "3", title: "Update Profile Page", description: "Revamp the user profile page with additional fields and improved UI.", priority: "Minor", status: "inprogress", estimate: "2h 15m", estimateConfirmed: true, dueDate: "2023-12-10", dueDateConfirmed: false, workLog: "0h 30m", workLogConfirmed: true },
        { id: "4", title: "Implement Search Functionality", description: "Add search functionality to filter tasks efficiently.", priority: "Major", status: "open", estimate: "2h 00m", estimateConfirmed: true, dueDate: "2023-12-15", dueDateConfirmed: true, workLog: "1h 00m", workLogConfirmed: false },
        { id: "5", title: "Optimize Database Queries", description: "Improve performance by optimizing slow database queries.", priority: "Critical", status: "review", estimate: "4h 00m", estimateConfirmed: false, dueDate: "2023-12-20", dueDateConfirmed: true, workLog: "2h 30m", workLogConfirmed: false },
        { id: "6", title: "Setup CI/CD Pipeline", description: "Automate deployments with a continuous integration and delivery pipeline.", priority: "Blocker", status: "backlog", estimate: "5h 00m", estimateConfirmed: true, dueDate: "2023-12-25", dueDateConfirmed: false, workLog: "1h 00m", workLogConfirmed: false },
        { id: "7", title: "Refactor Codebase", description: "Refactor the codebase to improve maintainability and scalability.", priority: "Major", status: "inprogress", estimate: "6h 00m", estimateConfirmed: true, dueDate: "2023-12-30", dueDateConfirmed: true, workLog: "3h 00m", workLogConfirmed: false },
        { id: "8", title: "Integrate Payment Gateway", description: "Add payment gateway integration to handle online transactions.", priority: "Critical", status: "open", estimate: "4h 30m", estimateConfirmed: false, dueDate: "2024-01-05", dueDateConfirmed: true, workLog: "2h 00m", workLogConfirmed: true },
        { id: "9", title: "Enhance Security Protocols", description: "Implement advanced security measures to protect user data.", priority: "Blocker", status: "review", estimate: "3h 30m", estimateConfirmed: true, dueDate: "2024-01-10", dueDateConfirmed: false, workLog: "1h 15m", workLogConfirmed: false },
        { id: "10", title: "Write Unit Tests", description: "Increase code coverage and reliability by writing comprehensive unit tests.", priority: "Minor", status: "done", estimate: "2h 45m", estimateConfirmed: false, dueDate: "2024-01-15", dueDateConfirmed: true, workLog: "0h 50m", workLogConfirmed: true },
    ];
    
    return (
        <div className={styles.board}>
            <div className={styles.grid}>
                {columns.map((column) => (
                    <TaskColumn key={column} column={column} tasks={taskData} />
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
