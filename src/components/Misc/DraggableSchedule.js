import React from 'react';
import Image from 'next/image';
import useSchedulerStore from '@/stores/useSchedulerStore';
import TeacherTypeBadge from './TeacherTypeBadge';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

/**
 * Your Component
 */
export default function DraggableSchedule({ data }) {
  const [isDraggable, setIsDraggable] = useState(true);
  //stores
  const { setDraggingSubject, subjectScheds } = useSchedulerStore();

  useEffect(() => {
    const subject = subjectScheds.find((subj) => subj.subjectCode == data.code);
    const isTheTeacher =
      subject?.schedules?.some((sched) => sched.teacherId == data.teacher.id) ||
      false;

    if (subject && !isTheTeacher) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  }, [subjectScheds, data]);

  return (
    <li
      className={classNames(
        `flex w-full flex-col gap-4 rounded-md border 
        border-gray-300 bg-white p-4 transition-all`,
        {
          'group cursor-grab hover:bg-primary-400 hover:text-white hover:shadow-lg':
            isDraggable,
          'cursor-not-allowed opacity-50': !isDraggable,
        }
      )}
      draggable={isDraggable}
      unselectable="on"
      onDragEnd={() => setDraggingSubject(null)}
      onDragStart={(e) => {
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
        setDraggingSubject(data);
      }}
    >
      <div className="flex flex-col">
        <p className="text-ellipsis whitespace-nowrap font-display font-semibold">
          {data.code}
        </p>
        <p className="mb-1 text-ellipsis whitespace-nowrap text-xs">
          {data.name}
        </p>
      </div>
      <div className="flex flex-col text-ship-gray-600 group-hover:text-white">
        <p className="text-sm">
          Units: <span className="font-medium">{data.units}</span>
        </p>
        <p className="text-sm">Time Left: 3hrs</p>
      </div>
      <div className="flex items-center gap-3">
        <Image
          src={data?.teacher?.image}
          alt="teacher image"
          width={36}
          height={36}
          draggable={false}
          className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="text-ellipsis whitespace-nowrap font-medium">
            {data?.teacher?.firstName} {data?.teacher?.lastName}
          </p>
          <TeacherTypeBadge isPartTime={data?.teacher?.type == 'part-time'} />
        </div>
      </div>
    </li>
  );
}
