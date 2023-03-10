import { MdInfo, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";
import { useField } from "formik";

export default function InputField({ label, infoMessage, ...props }) {
  const [showPass, setShowPass] = useState(false);
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {label && <label className="font-display font-medium">{label}</label>}
        {props.type == "password" ? (
          <button
            type="button"
            className="ml-auto"
            onClick={() => setShowPass((prev) => !prev)}
          >
            {!showPass && <MdVisibility size={20} />}
            {showPass && <MdVisibilityOff size={20} />}
          </button>
        ) : null}
      </div>
      <input
        {...field}
        {...props}
        type={
          props.type == "password"
            ? showPass
              ? "text"
              : "password"
            : props.type
        }
        className={`w-full rounded-[10px] border bg-white 
    p-4 font-body placeholder-ship-gray-300 focus:outline-none focus:ring-1
    ${
      meta.error && meta.touched
        ? "border-danger-500 focus:ring-danger-500"
        : "border-ship-gray-200 focus:ring-primary-500"
    }`}
      />
      {infoMessage && !meta.error && (
        <p className="flex gap-1 text-sm text-ship-gray-400">
          <span>
            <MdInfo size={16} className="-mt-[2px]" />
          </span>
          {infoMessage}
        </p>
      )}
      {meta.error && meta.touched && (
        <p className="flex gap-1 text-sm text-danger-500">
          {/* <span>
            <Error size={16} className="-mt-[2px]" />
          </span> */}
          {meta.error}
        </p>
      )}
    </div>
  );
}
