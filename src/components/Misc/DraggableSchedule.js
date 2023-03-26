import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import useSchedulerStore from '@/stores/useSchedulerStore';
import TeacherTypeBadge from './TeacherTypeBadge';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { parse, differenceInMinutes } from 'date-fns';
import { MdCheck } from 'react-icons/md';

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
  const { setDraggingSubject, subjectScheds } = useSchedulerStore();

  useEffect(() => {
    const subject = subjectScheds.find((subj) => subj.subjectCode == data.code);
    const isTheTeacher = subject?.teacherId == data.teacher.id;

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
    }
  }, [subjectScheds, data]);

  function subtractDuration(
    duration = { hours: 0, minutes: 0 },
    toSubtractDuration = { hours: 0, minutes: 0 }
  ) {
    // Convert duration1 to total minutes
    const duration1TotalMinutes = duration.hours * 60 + duration.minutes;

    // Convert duration2 to total minutes
    const duration2TotalMinutes =
      toSubtractDuration.hours * 60 + toSubtractDuration.minutes;

    // Subtract the two durations
    const resultTotalMinutes = duration1TotalMinutes - duration2TotalMinutes;

    // Convert the result back to hours and minutes
    const hours = Math.floor(resultTotalMinutes / 60);
    const minutes = resultTotalMinutes % 60;

    return { hours, minutes };
  }

  return (
    <li
      className={classNames(
        `flex w-full flex-col gap-4 rounded-md 
        border border-gray-300 bg-white p-4 transition-all`,
        {
          'group cursor-grab hover:border-primary-400 hover:bg-primary-400 hover:text-white hover:shadow-lg':
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
      <div className="flex items-center gap-3">
        <ImageWithFallback
          src={data?.teacher?.image}
          alt="teacher image"
          width={36}
          height={36}
          draggable={false}
          fallbackSrc="/images/teachers/default.jpg"
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
