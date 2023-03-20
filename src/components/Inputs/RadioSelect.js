import { MdInfo } from 'react-icons/md';

export default function RadioSelect({ label, children, infoMessage, error }) {
  return (
    <fieldset className="flex w-fit flex-col gap-2">
      {label && (
        <legend className="mb-2 font-display font-medium">{label}</legend>
      )}
      <div className="flex flex-col gap-3">{children}</div>
      {infoMessage && (
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
