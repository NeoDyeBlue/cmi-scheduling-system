import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { useField } from 'formik';
import classNames from 'classnames';

export default function RadioSelectItem({ children, long, checked, ...props }) {
  const [field, meta] = useField(props);
  return (
    <label className={`flex gap-4 ${long ? 'items-start' : ''} cursor-pointer`}>
      <input
        type="radio"
        className="hidden"
        {...field}
        {...props}
        checked={checked}
      />
      <div className={`relative ${long ? 'mt-1' : ''}`}>
        <span
          className={classNames('text-ship-gray-300 transition-opacity', {
            'opacity-0': checked,
          })}
        >
          <MdRadioButtonUnchecked size={24} />
        </span>
        <span
          className={classNames('text-ship-gray-300 transition-opacity', {
            'opacity-100': checked,
          })}
        >
          <MdRadioButtonChecked size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
