import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import modal from "./Modal.module.scss";

const Modal = ({ heading, isDialogOpen, setIsDialogOpen, children }) => {
    
    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={modal.backdrop} />
                <Dialog.Content className={modal.content} aria-describedby={undefined}>
                    <Dialog.Title className="DialogTitle">{heading}</Dialog.Title>
                    <Dialog.Close asChild>
                        <button className={modal.close} aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                    
                    {children}
                    
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
