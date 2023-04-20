import React from 'react';
import ImageWithFallback from './ImageWithFallback';
import useSchedulerStore from '@/stores/useSchedulerStore';
import TeacherTypeBadge from './TeacherTypeBadge';
import { useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { parse, differenceInMinutes } from 'date-fns';
import { MdCheck, MdMergeType } from 'react-icons/md';
import { subtractDuration } from '@/utils/time-utils';
import { shallow } from 'zustand/shallow';

/**
 * Your Component
 */
export default function DraggableSchedule({ data }) {
  const [isDraggable, setIsDraggable] = useState(true);
  const [isMerged, setIsMerged] = useState(false);
  const [remainingTime, setRemainingTime] = useState({
    hours: data.units,
    minutes: 0,
  });
  //stores
  const {
    subjectScheds,
    setDraggingSubject,
    hoveredMergeable,
    course,
    subjectsData,
  } = useSchedulerStore(
    useCallback(
      (state) => ({
        course: state.course,
        subjectScheds: state.subjectScheds,
        setDraggingSubject: state.setDraggingSubject,
        hoveredMergeable: state.hoveredMergeable,
        subjectsData: state.subjectsData,
      }),
      []
    ),
    shallow
  );

  const assignedCourses = useMemo(
    () =>
      subjectsData.find(
        (subjData) => subjData.id == `${data?.code}~${data?.teacher?._id}`
      )?.data?.teacher?.assignedCourses || [],
    [subjectsData, data]
  );

  useEffect(() => {
    setIsMerged(
      assignedCourses?.length > 1 &&
        assignedCourses.some(
          (assignedCourse) =>
            assignedCourse.code == course.code &&
            assignedCourse.year == course.year &&
            assignedCourse.section == course.section
        )
        ? true
        : false
    );
  }, [assignedCourses, course]);

  useEffect(() => {
    if (data?.teacher) {
      const subject = subjectScheds.find(
        (subj) => subj.subject.code == data.code
      );
      const isTheTeacher = subject?.teacher?._id == data?.teacher?._id;

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
    } else {
      setIsDraggable(false);
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
            data?.teacher &&
            hoveredMergeable?.subjectDataId ==
              `${data.code}~${data.teacher._id}`,
          'bg-white':
            data?.teacher &&
            hoveredMergeable?.subjectDataId !==
              `${data.code}~${data.teacher._id}`,
          'cursor-not-allowed opacity-50': !isDraggable,
        }
      )}
      draggable={isDraggable}
      unselectable="on"
      onDragEnd={() => setDraggingSubject(null)}
      onDragStart={(e) => {
        e.dataTransfer.clearData();
        e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({ id: `${data?.code}~${data?.teacher?._id}` })
        );
        setDraggingSubject(data);
      }}
    >
      <div className="flex flex-col overflow-hidden">
        <div className="flex justify-between gap-2">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold uppercase">
            {data.code}
          </p>
          {isMerged && (
            <MdMergeType
              size={16}
              className={classNames(
                'rotate-180 text-info-500 group-hover:text-white'
              )}
            />
          )}
        </div>
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
      {data.teacher ? (
        <div className="flex items-center gap-3 overflow-hidden">
          <ImageWithFallback
            src={data?.teacher?.image}
            alt="teacher image"
            width={36}
            height={36}
            draggable={false}
            fallbackSrc="/images/default-teacher.jpg"
            className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
          />
          <div className="flex flex-col overflow-hidden">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
              {data?.teacher?.firstName} {data?.teacher?.lastName}
            </p>
            <TeacherTypeBadge isPartTime={data?.teacher?.type == 'part-time'} />
          </div>
        </div>
      ) : (
        <p className="text-xs font-semibold text-danger-500">Unassigned</p>
      )}
    </li>
  );
}
