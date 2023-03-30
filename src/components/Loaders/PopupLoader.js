import { BarLoader } from 'react-spinners';
import ReactModal from 'react-modal';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';

export default function PopupLoader({ message, isOpen }) {
  const { theme } = resolveConfig(tailwindConfig);
  return (
    <ReactModal
      isOpen={isOpen}
      // closeTimeoutMS={300}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full p-4 z-100`}
      preventScroll={true}
      bodyOpenClassName="modal-open-body"
      className={`relative m-auto w-fit overflow-hidden rounded-[10px]
     bg-white p-6 shadow-lg outline-none md:max-w-[580px]`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center">{message}</p>
        <BarLoader
          color={theme.colors.primary[500]}
          size={14}
          width={200}
          className="flex h-[22.5px] w-full items-center justify-center"
        />
      </div>
    </ReactModal>
  );
}
