import forms from "../../Forms.module.scss";
import styles from './TaskForm.module.scss';

const TaskForm = () => {
    return (
        <div className={styles.TaskForm}>
            <form className={forms.form} onSubmit={(e) => e.preventDefault()}>
                <div className={forms.formLabel}>
                    <label>Title</label>
                </div>

                <div className={forms.formField}>
                    <input type="text" placeholder="Title"/>
                </div>

                <div className={forms.formLabel}>
                    <label>Description</label>
                </div>

                <div className={forms.formField}>
                    <textarea name="description" rows="4"></textarea>    
                </div>

                <div className={forms.formLabel}>
                    <label>Priority</label>
                </div>

                <div className={forms.formField}>
                    <select>
                        <option value="1">Minor</option>
                        <option value="2">Major</option>
                        <option value="3">Critical</option>
                        <option value="4">Blocker</option>
                    </select>
                </div>

                <div className={forms.formLabel}>
                    <label>Status</label>
                </div>

                <div className={forms.formField}>
                    <select>
                        <option value="backlog">Backlog</option>
                        <option value="open">Open</option>
                        <option value="inprogress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className={forms.formLabel}>
                    <label>Estimate</label>
                </div>

                <div className={forms.formField}>
                    <input type="text" placeholder="1h 15m" />
                    <input type="checkbox" />
                </div>

                <div className={forms.formLabel}>
                    <label>Due date</label>
                </div>

                <div className={forms.formField}>
                    <input type="date" />
                    <input type="checkbox" />
                </div>

                <div className={forms.formLabel}>
                    <label>WorkLog</label>
                </div>

                <div className={forms.formField}>
                    <input type="text" placeholder="1h 15m" />
                    <input type="checkbox" />
                </div>

                <div className={forms.emptyLabel}>
                    <button type="submit">Add Task</button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
