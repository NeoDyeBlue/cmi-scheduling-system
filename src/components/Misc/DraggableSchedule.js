import React from 'react';
import Image from 'next/image';
import useSchedulerStore from '@/stores/useSchedulerStore';
import TeacherTypeBadge from './TeacherTypeBadge';

/**
 * Your Component
 */
export default function DraggableSchedule({ data }) {
  //stores
  const { setDraggingSchedule } = useSchedulerStore();

  return (
    <li
      className="flex w-full cursor-grab flex-col gap-4 rounded-md
   border border-gray-300 bg-white p-4 transition-shadow hover:shadow-lg"
      draggable
      unselectable="on"
      onDragStart={(e) => {
        e.dataTransfer.clearData();
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
        setDraggingSchedule(data);
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
      <div className="flex flex-col">
        <p className="text-sm text-ship-gray-600">
          Units: <span className="font-medium">{data.units}</span>
        </p>
        <p className="text-sm text-ship-gray-600">Time Left: 3hrs</p>
      </div>
      <div className="flex items-center gap-3">
        <Image
          src={data?.teacher?.image}
          alt="teacher image"
          width={36}
          height={36}
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
