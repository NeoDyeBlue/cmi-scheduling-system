export default function Button({
  secondary = false,
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type,
  small,
}) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`${fullWidth ? "w-full" : "w-auto"} ${
        secondary
          ? "border border-primary-500 bg-white text-primary-500 hover:bg-primary-50"
          : "no-underline"
      } ${
        !secondary
          ? "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700"
          : ""
      } ${
        small ? "px-3 py-2" : "px-4 py-3"
      } flex w-full items-center justify-center gap-1 overflow-hidden text-ellipsis
          whitespace-nowrap rounded-lg text-center font-display font-medium
          transition-colors disabled:cursor-not-allowed disabled:opacity-60
      `}
    >
      {children}
    </button>
  );
}
