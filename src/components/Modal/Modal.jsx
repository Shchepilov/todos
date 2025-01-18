import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

const Modal = ({ children, onClose, handleClose, handleConfirm, heading, confirmText = "Confirm" }) => {
    return createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal}>
                <header className={styles.modalHeader}>
                    <h2>{heading}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <main className={styles.modalContent}>{children}</main>

                {(handleClose || handleConfirm) && (
                        <footer className={styles.modalActions}>
                            {handleClose && (
                                <button className={styles.cancelButton} onClick={handleClose} type="button">
                                    Cancel
                                </button>
                            )}
                            {handleConfirm && (
                                <button className={styles.confirmButton} onClick={handleConfirm} type="button">
                                    {confirmText}
                                </button>
                            )}
                        </footer>
                    )}
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default Modal;
