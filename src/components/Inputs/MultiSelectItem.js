import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import classNames from 'classnames';
import { useField } from 'formik';

export default function MultiSelectItem({ children, checked, long, ...props }) {
  const [field] = useField(props);
  return (
    <label
      className={classNames('flex cursor-pointer gap-4', long && 'items-start')}
    >
      <input
        type="checkbox"
        className="hidden"
        name={props.name}
        checked={checked}
        {...field}
        {...props}
      />
      <div className={classNames('relative', long && 'mt-1')}>
        <span
          className={classNames(
            'text-ship-gray-300 transition-opacity',
            checked && 'opacity-0'
          )}
        >
          <MdCheckBoxOutlineBlank size={24} />
        </span>
        <span
          className={classNames(
            'absolute top-0 left-0 z-10 text-primary-500 transition-opacity',
            !checked && 'opacity-0'
          )}
        >
          <MdCheckBox size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
