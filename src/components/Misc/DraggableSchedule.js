import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import useSchedulerStore from '@/stores/useSchedulerStore';
import TeacherTypeBadge from './TeacherTypeBadge';
import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { parse, differenceInMinutes } from 'date-fns';
import { MdCheck } from 'react-icons/md';
import { subtractDuration } from '@/utils/time-utils';
import { shallow } from 'zustand/shallow';

/**
 * Your Component
 */
export default function DraggableSchedule({ data }) {
  const [isDraggable, setIsDraggable] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    hours: data.units,
    minutes: 0,
  });
  //stores
  const { subjectScheds, setDraggingSubject, hoveredMergeable } =
    useSchedulerStore(
      useCallback(
        (state) => ({
          subjectScheds: state.subjectScheds,
          setDraggingSubject: state.setDraggingSubject,
          hoveredMergeable: state.hoveredMergeable,
        }),
        []
      ),
      shallow
    );

  useEffect(() => {
    const subject = subjectScheds.find(
      (subj) => subj.subject.code == data.code
    );
    const isTheTeacher = subject?.teacher.teacherId == data.teacher.teacherId;

    if (subject && !isTheTeacher) {
      setIsDraggable(false);
    } else {
      let totalMinutesDuration = 0;
      subject?.schedules?.forEach((sched) => {
        sched.times.forEach((time) => {
          const start = parse(time.start, 'hh:mm a', new Date());
          const end = parse(time.end, 'hh:mm a', new Date());

          totalMinutesDuration += differenceInMinutes(end, start);
        });
      });

      const hoursDuration = Math.floor(totalMinutesDuration / 60);
      const minutesDuration = totalMinutesDuration % 60;

      const { hours, minutes } = subtractDuration(
        { hours: data.units, minutes: 0 },
        {
          hours: hoursDuration,
          minutes: minutesDuration,
        }
      );

      setRemainingTime({
        hours,
        minutes,
      });

      if (hours <= 0 && minutes <= 0) {
        setIsDraggable(false);
      } else {
        setIsDraggable(true);
      }
      // setIsDraggable(subject.isCompleted);
    }
  }, [subjectScheds, data]);

  return (
    <li
      className={classNames(
        `flex w-full flex-col gap-4 overflow-hidden rounded-md
        border border-gray-300 p-4  transition-all`,
        {
          'group cursor-grab hover:border-primary-400 hover:bg-primary-400 hover:text-white hover:shadow-lg':
            isDraggable,
          'animate-pulse border-info-500 bg-info-100':
            hoveredMergeable == `${data.code}~${data.teacher.teacherId}`,
          'bg-white':
            hoveredMergeable !== `${data.code}~${data.teacher.teacherId}`,
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
      <div className="flex flex-col overflow-hidden">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold uppercase">
          {data.code}
        </p>
        <p className="mb-1 text-xs">{data.name}</p>
      </div>
      <div className="flex flex-col text-ship-gray-600 group-hover:text-white">
        <p className="text-sm">
          Units: <span className="font-medium">{data.units}</span>
        </p>
        <p className="flex gap-2 text-sm">
          Time Left:{' '}
          {remainingTime.hours > 0 || remainingTime.minutes > 0 ? (
            `${remainingTime.hours > 0 ? `${remainingTime.hours}h` : ''} ${
              remainingTime.minutes > 0 ? ` ${remainingTime.minutes}m` : ''
            }`
          ) : (
            <span className="flex items-center gap-1 leading-none text-success-500">
              Completed <MdCheck size={12} />
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3 overflow-hidden">
        <ImageWithFallback
          src={data?.teacher?.image}
          alt="teacher image"
          width={36}
          height={36}
          draggable={false}
          fallbackSrc="/images/teachers/default.jpg"
          className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
        />
        <div className="flex flex-col overflow-hidden">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            {data?.teacher?.firstName} {data?.teacher?.lastName}
          </p>
          <TeacherTypeBadge isPartTime={data?.teacher?.type == 'part-time'} />
        </div>
      </div>
    </li>
  );
}
