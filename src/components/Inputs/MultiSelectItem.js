import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { useField } from "formik";

export default function MultiSelectItem({ children, checked, long, ...props }) {
  const [field] = useField(props);
  return (
    <label className={`flex gap-4 ${long ? "items-start" : ""} cursor-pointer`}>
      <input
        type="checkbox"
        className="hidden"
        name={props.name}
        checked={checked}
        {...field}
        {...props}
      />
      <div className={`relative ${long ? "mt-1" : ""}`}>
        <span
          className={`text-ship-gray-300 ${
            checked ? "opacity-0" : ""
          } transition-opacity`}
        >
          <MdCheckBoxOutlineBlank size={24} />
        </span>
        <span
          className={`absolute top-0 left-0 z-10 text-primary-500 opacity-0 ${
            checked ? "opacity-100" : ""
          } transition-opacity`}
        >
          <MdCheckBox size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
