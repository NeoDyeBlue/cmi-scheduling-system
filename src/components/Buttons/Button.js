import classNames from 'classnames';

export default function Button({
  secondary = false,
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type,
  small = false,
}) {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        `flex items-center justify-center gap-1 overflow-hidden text-ellipsis 
        whitespace-nowrap rounded-lg text-center font-display font-medium transition-colors 
        disabled:cursor-not-allowed disabled:opacity-60`,
        { 'w-full': fullWidth },
        {
          'border border-primary-500 bg-white text-primary-500 hover:bg-primary-50':
            secondary,
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700':
            !secondary,
        },
        { 'px-3 py-2': small, 'px-4 py-3': !small }
      )}
    >
      {children}
    </button>
  );
}
