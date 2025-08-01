import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import modal from "./Modal.module.scss";

const Modal = ({ heading, align='center', size='small', isDialogOpen, setIsDialogOpen, children }) => {
    
    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={modal.backdrop} />
                <div className={modal.wrapper}>
                <Dialog.Content className={`${modal.content} ${modal[align]} ${modal[size]}`} aria-describedby={undefined}>
                    
                    <Dialog.Title className={modal.title}>{heading}</Dialog.Title>
                    <Dialog.Close asChild>
                        <button className={modal.close} aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                    
                    {children}
                    
                </Dialog.Content>
                </div>
                
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
