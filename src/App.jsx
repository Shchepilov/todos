import styles from './App.module.css'
import Auth from './Auth';

const App = () => {
  return (
    <div className={styles.App}>
      <header>
        <Auth />
      </header>
      App
    </div>
  );
}
 
export default App;
