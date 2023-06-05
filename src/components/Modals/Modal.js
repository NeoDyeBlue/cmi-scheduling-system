import { MdClose } from 'react-icons/md';
import ReactModal from 'react-modal';
import { useRef } from 'react';
import { SquareButton } from '../Buttons';

export default function Modal({ onClose, isOpen, label, children }) {
  ReactModal.setAppElement('#__next');
  const modalRef = useRef();
  return (
    <ReactModal
      ref={modalRef}
      // contentLabel="Offer Modal"
      isOpen={isOpen}
      overlayClassName="bg-ship-gray-500/20 fixed top-0 z-50 flex h-full w-full items-end md:p-6 overflow-y-auto"
      preventScroll={true}
      onRequestClose={onClose}
      closeTimeoutMS={150}
      // bodyOpenClassName="modal-open-body"
      className="relative w-full overflow-hidden rounded-t-lg
     bg-white py-6 shadow-lg md:m-auto md:max-w-[520px] md:rounded-lg"
    >
      <div className="custom-scrollbar mx-auto max-h-[70vh] overflow-y-auto px-6 md:max-h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="font-display text-2xl font-semibold capitalize">
              {label}
            </h1>
            <SquareButton icon={<MdClose size={24} />} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </ReactModal>
  );
}
