import { FormattedMessage } from 'react-intl';
import Modal from '@components/Modal/Modal';
import Row from '@components/Row/Row';
import Button from '@components/Button/Button';

const ConfirmationModal = ({
    heading,
    message,
    isDialogOpen,
    setIsDialogOpen,
    onConfirm,
    confirmLabel = <FormattedMessage id="common.delete" />,
    cancelLabel = <FormattedMessage id="common.cancel" />,
    confirmVariation = 'confirmation',
}) => {
    const handleConfirm = () => {
        onConfirm();
        setIsDialogOpen(false);
    };

    return (
        <Modal heading={heading} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}>
            <p>{message}</p>
            <Row equal>
                <Button variation="secondary" onClick={() => setIsDialogOpen(false)}>
                    {cancelLabel}
                </Button>
                <Button variation={confirmVariation} onClick={handleConfirm}>
                    {confirmLabel}
                </Button>
            </Row>
        </Modal>
    );
};

export default ConfirmationModal;
