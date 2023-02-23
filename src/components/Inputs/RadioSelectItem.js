import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { useField } from "formik";

export default function RadioSelectItem({ children, long, checked, ...props }) {
  const [field, meta] = useField(props);
  return (
    <label className={`flex gap-4 ${long ? "items-start" : ""} cursor-pointer`}>
      <input
        type="radio"
        className="hidden"
        {...field}
        {...props}
        checked={checked}
      />
      <div className={`relative ${long ? "mt-1" : ""}`}>
        <span
          className={`text-ship-gray-300 ${
            checked ? "opacity-0" : ""
          } transition-opacity`}
        >
          <MdRadioButtonUnchecked size={24} />
        </span>
        <span
          className={`absolute top-0 left-0 z-10 text-primary-500 opacity-0 ${
            checked ? "opacity-100" : ""
          } transition-opacity`}
        >
          <MdRadioButtonChecked size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
