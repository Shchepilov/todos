import { useEffect } from 'react';
import styles from './TodoList.module.css'
import { useStore } from '../store/store';

const TodoList = () => {
  const { isLoading, todos, fetchTodos } = useStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  console.log(todos);

  return (
    <div>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <ul className={styles.TodoList}>
                {todos.map((todo) => (
                <li key={todo.id}>
                    <span>{todo.title}</span>
                </li>
                ))}
            </ul>
        )}
      </div>
  );
}
 
export default TodoList;
