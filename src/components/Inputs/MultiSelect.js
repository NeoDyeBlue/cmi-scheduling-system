import { MdInfo } from 'react-icons/md';

export default function MultiSelect({
  label,
  children,
  infoMessage,
  error,
  disabled = false,
}) {
  return (
    <fieldset className="flex flex-col gap-2" disabled={disabled}>
      {label && (
        <legend className="mb-2 font-display font-medium">{label}</legend>
      )}
      <div className="flex flex-col gap-3">{children}</div>
      {infoMessage && !error && (
        <p className="flex gap-1 text-sm text-ship-gray-400">
          <span>
            <MdInfo size={16} />
          </span>
          {infoMessage}
        </p>
      )}
      {error && <p className="flex gap-1 text-sm text-danger-500">{error}</p>}
    </fieldset>
  );
}
