import { MdAdd } from 'react-icons/md';
import classNames from 'classnames';

export default function CreateButton({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type,
  small = false,
  text,
}) {
  return (
    <button
      type={type ? type : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        `flex items-center justify-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap 
        rounded-lg bg-green-500 text-center font-display font-medium text-white transition-colors 
        hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60`,
        { 'w-full': fullWidth },
        { 'px-3 py-2': small, 'px-4 py-3': !small }
      )}
    >
      <MdAdd size={24} /> {text}
    </button>
  );
}
