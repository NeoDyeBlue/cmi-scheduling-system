import { MdCircle, MdIncompleteCircle } from 'react-icons/md';
import classNames from 'classnames';

export default function TeacherTypeBadge({ isPartTime = false }) {
  return (
    <p
      className={classNames(
        'flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-2 py-[0.1rem] text-xs font-semibold',
        {
          'border-warning-600 bg-warning-100 text-warning-600': isPartTime,
          'border-success-600 bg-success-100 text-success-600': !isPartTime,
        }
      )}
    >
      {isPartTime ? <MdIncompleteCircle size={10} /> : <MdCircle size={10} />}
      {isPartTime ? 'part-time' : 'full-time'}
    </p>
  );
}
