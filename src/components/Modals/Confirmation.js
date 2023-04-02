import { Button } from '../Buttons';
import Modal from './Modal';

export default function Confirmation({
  onConfirm = () => {},
  onCancel = () => {},
  isOpen = false,
  label = '',
  message = '',
  confirmButtonText = '',
  cancelButtonText = '',
}) {
  return (
    <Modal isOpen={isOpen} label={label} onClose={onCancel}>
      <div className="flex flex-col gap-6">
        <p>{message}</p>
        <div className="flex justify-between gap-4">
          <Button onClick={onCancel} secondary>
            {cancelButtonText || 'Cancel'}
          </Button>
          <Button onClick={onConfirm}>{confirmButtonText || 'Confirm'}</Button>
        </div>
      </div>
    </Modal>
  );
}
