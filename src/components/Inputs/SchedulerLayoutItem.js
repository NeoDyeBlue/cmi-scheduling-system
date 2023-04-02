import { forwardRef } from 'react';
import { MdRemove } from 'react-icons/md';
import { ImageWithFallback } from '../Misc';
import classNames from 'classnames';

const SchedulerLayoutItem = forwardRef(function SchedulerLayoutItem(
  {
    layoutItemData,
    subjectData,
    onRemove = () => {},
    isResizing,
    key,
    style,
    className,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      key={key}
      style={{ ...style }}
      className={className}
      {...props}
    >
      {!layoutItemData.static && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={classNames(
            `absolute top-0 right-0 m-1 hidden h-[20px] w-[20px] items-center 
                      justify-center rounded-full border border-gray-200 bg-white text-center 
                      `,
            {
              'group-hover:flex': !isResizing,
            }
          )}
        >
          <MdRemove size={16} />
        </button>
      )}
      <ImageWithFallback
        src={subjectData?.teacher?.image}
        alt="teacher image"
        width={36}
        height={36}
        draggable={false}
        fallbackSrc="/images/default-teacher.jpg"
        className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
      />
      <div className="flex flex-col text-center">
        <p className="font-display font-semibold uppercase">
          {subjectData.code}
        </p>
        <p className="text-xs font-medium">
          {subjectData?.teacher?.firstName} {subjectData?.teacher?.lastName}
        </p>
      </div>
      {layoutItemData.static && (
        <p className="text-center text-sm font-medium uppercase">
          {subjectData.course.code} {subjectData.course.year}
          {subjectData.course.section}
        </p>
      )}
    </div>
  );
});

export default SchedulerLayoutItem;
