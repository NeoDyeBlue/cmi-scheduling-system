import { MdAdd } from 'react-icons/md';
import classNames from 'classnames';

export default function CreateButton({
  onClick,
  disabled = false,
  fullWidth = false,
  type,
  small = false,
  text,
  icon = <MdAdd size={24} />,
  isForImporting = false,
}) {
  return (
    <button
      type={type ? type : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        `flex items-center justify-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap 
        rounded-lg text-center font-display font-medium transition-colors 
        disabled:cursor-not-allowed disabled:opacity-60`,
        { 'w-full': fullWidth },
        {
          'border-2 border-green-500 bg-white text-green-500 hover:bg-green-500 hover:text-white active:border-green-700 active:bg-green-700':
            isForImporting,
          'bg-green-500 text-white hover:bg-green-600 active:bg-green-700':
            !isForImporting,
        },
        { 'px-2 py-1': small, 'px-3 py-2': !small }
      )}
    >
      {icon} {text}
    </button>
  );
}
