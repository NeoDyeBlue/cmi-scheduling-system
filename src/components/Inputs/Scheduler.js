import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { parse, format, addMinutes, differenceInMinutes } from 'date-fns';
import useSchedulerStore from '@/stores/useSchedulerStore';
import { MdRemove } from 'react-icons/md';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { shallow } from 'zustand/shallow';
import { ImageWithFallback } from '../Misc';
import { subtractDuration } from '@/utils/time-utils';

export default function Scheduler({
  startTime = '1:00 AM',
  endTime = '12:00 AM',
  interval = 30,
  roomData,
  semester,
}) {
  //   const ResponsiveGridLayout = WidthProvider(GridLayout);
  const ResponsiveGridLayout = useMemo(() => WidthProvider(GridLayout), []);
  const [layout, setLayout] = useState([]);
  const [isDraggingFromOutside, setIsDraggingFromOutside] = useState(false);
  // const [subjectsData, setSubjectsData] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [restrictionLayouItemIds, setRestrictionLayoutItemIds] = useState([]);

  // const [scheduleLayout, setScheduleLayout] = useState([]);

  //stores
  const {
    course,
    courseSubjects,
    draggingSubject,
    subjectScheds,
    subjectsData,
    roomsSubjSchedsLayouts,
    oldSchedsData,
    setSubjectScheds,
    setRoomSubjSchedsLayout,
    setAllRoomSubjSchedsLayout,
    setOldSchedsData,
  } = useSchedulerStore(
    useCallback(
      (state) => ({
        course: state.course,
        courseSubjects: state.courseSubjects,
        draggingSubject: state.draggingSubject,
        subjectScheds: state.subjectScheds,
        subjectsData: state.subjectsData,
        oldSchedsData: state.oldSchedsData,
        roomsSubjSchedsLayouts: state.roomsSubjSchedsLayouts,
        setSubjectScheds: state.setSubjectScheds,
        setRoomSubjSchedsLayout: state.setRoomSubjSchedsLayout,
        setAllRoomSubjSchedsLayout: state.setAllRoomSubjSchedsLayout,
        setOldSchedsData: state.setOldSchedsData,
      }),
      []
    ),
    shallow
  );

  // memos
  const timeData = useMemo(() => {
    const start = parse(startTime, 'hh:mm a', new Date());
    const end = parse(endTime, 'hh:mm a', new Date());

    let current = start;
    const times = [];

    while (current <= end) {
      times.push(format(current, 'h:mm a'));
      current = addMinutes(current, interval);
    }

    const pairedTimes = times.reduce(
      (accumulator, currentItem, currentIndex) => {
        if (currentIndex !== times.length - 1) {
          return [...accumulator, [currentItem, times[currentIndex + 1]]];
        }
        return accumulator;
      },
      []
    );

    return pairedTimes;
  }, [startTime, endTime, interval]);

  //layouts
  const headers = useMemo(
    () => [
      { i: 'times-left', name: 'Time', x: 0, y: 0, w: 1, h: 1, static: true },
      { i: 'mon', name: 'Monday', x: 1, y: 0, w: 1, h: 1, static: true },
      { i: 'tue', name: 'Tuesday', x: 2, y: 0, w: 1, h: 1, static: true },
      { i: 'wed', name: 'Wednesday', x: 3, y: 0, w: 1, h: 1, static: true },
      { i: 'thu', name: 'Thursday', x: 4, y: 0, w: 1, h: 1, static: true },
      { i: 'fri', name: 'Friday', x: 5, y: 0, w: 1, h: 1, static: true },
      { i: 'sat', name: 'Saturday', x: 6, y: 0, w: 1, h: 1, static: true },
      { i: 'sun', name: 'Sunday', x: 7, y: 0, w: 1, h: 1, static: true },
      { i: 'times-right', name: 'Time', x: 8, y: 0, w: 1, h: 1, static: true },
    ],
    []
  );

  const timeLayout = useMemo(
    () =>
      timeData.map((times, index) => [
        {
          i: `${index}-${times[0]}`,
          times,
          x: 0,
          y: index + 1,
          w: 1,
          h: 1,
          static: true,
        },
        {
          i: `${index}-${times[1]}`,
          times,
          x: headers.length,
          y: index + 1,
          w: 1,
          h: 1,
          static: true,
        },
      ]),
    [timeData, headers.length]
  );

  //elements
  const headerColumns = headers.map((item) => (
    <div
      key={item.i}
      className="flex h-[40px] items-center justify-center overflow-hidden whitespace-nowrap"
    >
      <p className="font-display text-xs font-semibold capitalize leading-none">
        {item.name}
      </p>
    </div>
  ));

  const timeRows = timeLayout.flat().map((item) => (
    <div
      key={item.i}
      className={classNames(
        'flex h-[40px] items-center justify-center gap-1 overflow-hidden px-3 text-center text-xs capitalize leading-none'
      )}
    >
      <p>{item.times[0]}</p> - <p>{item.times[1]}</p>
    </div>
  ));

  const scheduleCells = layout
    .filter((item) => {
      const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
        item.i
      );
      return subjectsData.some(
        (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
      );
    })
    .map((schedule) => {
      const data = subjectsData.find((subject) => {
        const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
          schedule.i
        );
        return subject.id == `${subjectCode}~${teacherId}~${courseYearSec}`;
      })?.data;

      return (
        <div
          key={schedule.i}
          className={classNames(
            'group relative flex select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border p-2',
            {
              'border-warning-400 bg-warning-100':
                data?.teacher?.type == 'part-time' && !schedule.static,
              'border-success-400 bg-success-100':
                data?.teacher?.type == 'full-time' && !schedule.static,
              'border border-gray-400 bg-gray-100': schedule.static,
            },
            {
              'cursor-default': schedule.static,
              'cursor-move': !schedule.static,
            }
          )}
        >
          {!schedule.static && (
            <button
              onClick={(e) => {
                removeLayoutItem(schedule.i);
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
            src={data?.teacher?.image}
            alt="teacher image"
            width={36}
            height={36}
            draggable={false}
            fallbackSrc="/images/default-teacher.jpg"
            className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
          />
          <div className="flex flex-col text-center">
            <p className="font-display font-semibold uppercase">{data.code}</p>
            <p className="text-xs font-medium">
              {data?.teacher?.firstName} {data?.teacher?.lastName}
            </p>
          </div>
          {schedule.static && (
            <p className="text-center text-sm font-medium uppercase">
              {data.course.code} {data.course.year}
              {data.course.section}
            </p>
          )}
        </div>
      );
    });

  const cellRestrictions = layout
    .filter((item) => {
      return restrictionLayouItemIds.includes(item.i);
    })
    .map((restriction) => {
      return <div key={restriction.i} className="bg-gray-300/50"></div>;
    });

  //effects
  useEffect(
    () => {
      //get the existing room layout
      const existingRoomLayout =
        roomsSubjSchedsLayouts.find((room) => room.roomCode == roomData.code)
          ?.layout || [];
      //if there is an existing room layout
      if (existingRoomLayout.length) {
        setLayout([...headers, ...existingRoomLayout, ...timeLayout.flat()]);
      } else {
        const roomSubjectsLayout = [];
        const roomSubjectScheds = [];
        //for each subject schedule
        roomData?.schedules?.forEach((subjSchedule) => {
          //for each schedule day times of the subject
          // console.log(
          //   `${course.code}${course.year}${course.section}`,
          //   `${subjSchedule.course.code}${subjSchedule.course.year}${subjSchedule.course.section}`,
          //   courseSubjects,
          //   subjSchedule.subject.code,
          //   !courseSubjects.some(
          //     (subject) => subject.code == subjSchedule.subject.code
          //   )
          // );

          subjSchedule.dayTimes.forEach((dayTime) => {
            //for each times of the day
            dayTime.times.forEach((time) => {
              const yStart =
                timeData.findIndex((timePairs) => timePairs[0] == time.start) +
                1;
              const yEnd =
                timeData.findIndex((timePairs) => timePairs[1] == time.end) + 1;
              roomSubjectsLayout.push({
                i: `${subjSchedule.subject.code}~${
                  subjSchedule.teacher.teacherId
                }~${subjSchedule.course.code}${subjSchedule.course.year}${
                  subjSchedule.course.section
                }~${nanoid(10)}`,
                x: dayTime.day,
                w: 1,
                y: yStart,
                minH: 1,
                h: Math.abs(yEnd - yStart) + 1,
                maxW: 1,
                /**
                 * will be static only if:
                 * - subject is not in the courseSubjects
                 * - if subject is in the courseSubjects, check if it has the same year and section
                 */
                static:
                  !courseSubjects.some(
                    (subject) => subject.code == subjSchedule.subject.code
                  ) ||
                  `${course.code}${course.year}${course.section}` !==
                    `${subjSchedule.course.code}${subjSchedule.course.year}${subjSchedule.course.section}`,
              });
            });
          });
          roomSubjectScheds.push({
            subjectCode: subjSchedule.subject.code,
            teacherId: subjSchedule.teacher.id,
            schedules: subjSchedule.dayTimes,
          });
        });
        // setSubjectsData(roomSubjectsData);
        setLayout([...headers, ...roomSubjectsLayout, ...timeLayout.flat()]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (draggingSubject) {
        createRestrictions(layout, draggingSubject);
        setIsDraggingFromOutside(true);
      } else {
        removeRestrictions();
        setIsDraggingFromOutside(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggingSubject]
  );

  useEffect(
    () => {
      const subjSchedIds = subjectsData.map((data) => data.id);
      const courseSchedsData = createCourseSubjectSchedules(subjSchedIds);
      const subjSchedItems = layout.filter((item) => {
        const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
          item.i
        );
        return subjSchedIds.includes(
          `${subjectCode}~${teacherId}~${courseYearSec}`
        );
      });
      setSubjectScheds(courseSchedsData);
      setRoomSubjSchedsLayout(roomData.code, subjSchedItems);

      // if (!oldSchedsData) {
      //   setOldSchedsData({ course, subjectScheds: courseSchedsData });
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      layout,
      subjectsData,
      timeData,
      setSubjectScheds,
      setRoomSubjSchedsLayout,
      roomData.code,
    ]
  );

  //other funcs
  function createCourseSubjectSchedules(subjSchedIds = []) {
    const subjSchedItems = layout.filter((item) => {
      const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
        item.i
      );
      return (
        subjSchedIds.includes(`${subjectCode}~${teacherId}~${courseYearSec}`) &&
        !item.static
      );
    });

    //remove subjSchedIds that has no layout item
    const filteredSubjSchedIds = subjSchedIds.filter((id) =>
      subjSchedItems.some((item) => {
        const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
          item.i
        );
        return id == `${subjectCode}~${teacherId}~${courseYearSec}`;
      })
    );

    const subjSchedIdsParsed = filteredSubjSchedIds.map((id) => {
      const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(id);
      return { code: subjectCode, teacher: teacherId, courseYearSec };
    });

    const newRoomSubjectScheds = [];
    //for each schedIds

    subjSchedIdsParsed.forEach(({ code, teacher, courseYearSec }) => {
      //get the subject layout items of the same id
      const subjSchedLayoutItems = subjSchedItems.filter((item) => {
        const {
          subjectCode: itemSubjCode,
          teacherId: itemTeacherId,
          courseYearSec: itemCourseYearSec,
        } = parseSubjSchedId(item.i);
        return (
          code == itemSubjCode &&
          teacher == itemTeacherId &&
          courseYearSec == itemCourseYearSec
        );
      });
      const subjectData = subjectsData.find(
        (data) => data.id == `${code}~${teacher}~${courseYearSec}`
      );
      //set the subject's times and days
      const schedules = subjSchedLayoutItems.map((layout) => ({
        day: layout.x,
        time: {
          start: timeData[layout.y - 1][0],
          end: timeData[layout.y - 1 + layout.h - 1][1],
        },
      }));

      //check if completed or not
      let totalMinutesDuration = 0;
      let isNotCompleted = true;
      schedules?.forEach((sched) => {
        const start = parse(sched.time.start, 'hh:mm a', new Date());
        const end = parse(sched.time.end, 'hh:mm a', new Date());

        totalMinutesDuration += differenceInMinutes(end, start);
      });

      const hoursDuration = Math.floor(totalMinutesDuration / 60);
      const minutesDuration = totalMinutesDuration % 60;

      const { hours, minutes } = subtractDuration(
        { hours: subjectData.data.units, minutes: 0 },
        {
          hours: hoursDuration,
          minutes: minutesDuration,
        }
      );

      if (hours <= 0 && minutes <= 0) {
        isNotCompleted = false;
      }

      //group by day
      const groupedByDay = [];
      for (let day = 1; day <= 7; day++) {
        const daySchedules = schedules.filter(
          (schedule) => schedule.day == day
        );
        if (daySchedules.length) {
          groupedByDay.push({
            day,
            room: {
              _id: roomData._id,
              code: roomData.code,
            },
            times: daySchedules.map((daySchedule) => ({
              start: daySchedule.time.start,
              end: daySchedule.time.end,
            })),
          });
        }
      }
      //add to the sched array
      newRoomSubjectScheds.push({
        subject: {
          _id: subjectData.data._id,
          code: subjectData.data.code,
        },
        teacher: {
          _id: subjectData.data.teacher._id,
          teacherId: subjectData.data.teacher.teacherId,
        },
        isCompleted: !isNotCompleted,
        schedules: [...groupedByDay],
      });
    });

    let newScheds = [];

    if (subjectScheds.length) {
      subjectScheds.forEach((subjSched) => {
        const newSubjSched = newRoomSubjectScheds.find(
          (newRoomSubjSched) =>
            subjSched.subject.code == newRoomSubjSched.subject.code &&
            subjSched.teacher.teacherId == newRoomSubjSched.teacher.teacherId
        );

        //check if new sched exists then update the new room scheds
        if (newSubjSched) {
          newScheds.push({
            ...newSubjSched,
            schedules: [
              ...subjSched.schedules.filter(
                (sched) => sched.room.code !== roomData.code
              ),
              ...newSubjSched.schedules,
            ],
          });
        } else {
          newScheds.push({
            ...subjSched,
            schedules: [
              ...subjSched.schedules.filter(
                (sched) => sched.room.code !== roomData.code
              ),
            ],
          });
        }
      });
    } else {
      newScheds = newRoomSubjectScheds;
    }

    return [
      ...newScheds.filter((newSched) => newSched.schedules.length),
      ...newRoomSubjectScheds.filter(
        (sched) =>
          !newScheds.some(
            (newSched) =>
              sched.subject.code == newSched.subject.code &&
              sched.teacher.teacherId == newSched.teacher.teacherId
          )
      ),
    ];
  }

  function parseSubjSchedId(id, separator = '~') {
    const [subjectCode, teacherId, courseYearSec, nanoId] = id.split(separator);
    return { subjectCode, teacherId, courseYearSec, nanoId };
  }

  function removeLayoutItem(layoutId) {
    const newLayout = layout.filter((item) => item.i !== layoutId);
    setLayout(newLayout);
    removeRestrictions();
  }

  /**
   *
   * @param {Array} layoutSource - what layout to use
   * @param {String} layoutItemId - the layout "i" in SUBJCODE~##-####~nanoId format
   */

  function updateSubjSchedsMaxH(layoutSource, layoutItemId) {
    //parse layoutItemId
    const { subjectCode, teacherId, courseYearSec } =
      parseSubjSchedId(layoutItemId);
    //get the subject data ids
    const subjSchedIds = subjectsData.map((data) => data.id);
    //get the layout items with the same ids
    const roomSubjSchedItems = layoutSource.filter((item) => {
      const {
        subjectCode: itemSubjectCode,
        teacherId: itemTeacherId,
        courseYearSec: itemCourseYearSec,
      } = parseSubjSchedId(item.i);
      return subjSchedIds.includes(
        `${itemSubjectCode}~${itemTeacherId}~${itemCourseYearSec}`
      );
    });
    //get the layout from other rooms
    const otherRoomLayouts = roomsSubjSchedsLayouts.filter(
      (roomLayout) => roomLayout.roomCode !== roomData.code
    );
    //get the subject's data
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
    )?.data;

    //if there is a subject data update all the maxH of the same subject from the same course year and section
    if (subjectData) {
      const unitsMaxSpan = subjectData.units * 2;
      const subjSchedItems = [
        ...roomSubjSchedItems,
        ...(otherRoomLayouts.length ? otherRoomLayouts : [])
          .map((obj) => obj.layout)
          .flat(),
      ].filter((item) => {
        const {
          subjectCode: itemSubjectCode,
          teacherId: itemTeacherId,
          courseYearSec: itemCourseYearSec,
        } = parseSubjSchedId(item.i);
        return (
          subjectCode == itemSubjectCode &&
          teacherId == itemTeacherId &&
          courseYearSec == itemCourseYearSec
        );
      });

      const { totalRowSpanCount } = subjSchedItems.reduce(
        (accumulator, currentItem) => {
          return {
            totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
            itemCount: (accumulator.itemCount += 1),
          };
        },
        { totalRowSpanCount: 0, itemCount: 0 }
      );

      const remainingRowSpan = unitsMaxSpan - totalRowSpanCount;

      const updatedSubjSchedItems = subjSchedItems.map((item) => ({
        ...item,
        maxH: remainingRowSpan + item.h,
      }));

      // update the layout items of other rooms
      const updatedRoomLayouts = otherRoomLayouts.map((roomLayout) => ({
        roomCode: roomLayout.roomCode,
        layout: [
          ...roomLayout.layout.filter(
            (item) =>
              !updatedSubjSchedItems.some(
                (updatedItem) => item.i == updatedItem.i
              )
          ),
          ...updatedSubjSchedItems.filter((updatedItem) =>
            roomLayout.layout.some((item) => updatedItem.i == item.i)
          ),
        ],
      }));

      const newRoomLayout = {
        roomCode: roomData.code,
        layout: [
          ...roomSubjSchedItems.filter(
            (item) =>
              !updatedSubjSchedItems.some(
                (updatedItem) => updatedItem.i == item.i
              )
          ),
          ...updatedSubjSchedItems.filter((updatedItem) =>
            roomSubjSchedItems.some((item) => updatedItem.i == item.i)
          ),
        ],
      };

      setAllRoomSubjSchedsLayout([newRoomLayout, ...updatedRoomLayouts]);
      setLayout([...headers, ...newRoomLayout.layout, ...timeLayout.flat()]);
    } else {
      setLayout(layoutSource);
    }
  }

  /**
   *
   * @param {Array} layoutSource - what layout to use
   * @param {Object} layoutItem - the layout item to check for adjacents
   * @param {Boolean} fromDrop - if from dropped item
   * @returns {Array} - the new layout with merged items
   */

  function mergeYAdjacentSubjScheds(
    layoutSource,
    layoutItem,
    fromDrop = false
  ) {
    const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
      layoutItem.i
    );
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
    )?.data;
    if (subjectData) {
      const subjSchedItems = layoutSource.filter((item) => {
        const {
          subjectCode: itemSubjCode,
          teacherId: itemTeacherId,
          courseYearSec: itemCourseYearSec,
        } = parseSubjSchedId(item.i);
        return (
          subjectCode == itemSubjCode &&
          teacherId == itemTeacherId &&
          courseYearSec == itemCourseYearSec
        );
      });

      if (fromDrop) {
        subjSchedItems.push({
          ...layoutItem,
        });
      }

      const mergedIds = [];
      const mergedItems = [];

      subjSchedItems.forEach((item) => {
        const yAdjacents = subjSchedItems.filter(
          (subjSchedItem) =>
            subjSchedItem.i !== item.i &&
            (subjSchedItem.y + subjSchedItem.h == item.y ||
              subjSchedItem.y == item.y + item.h) &&
            !mergedIds.includes(subjSchedItem.i) &&
            subjSchedItem.x == item.x
        );

        if (yAdjacents.length) {
          const { totalMergingRowSpans, yStart } = yAdjacents.reduce(
            (accumulator, currentItem) => {
              return {
                totalMergingRowSpans: (accumulator.totalMergingRowSpans +=
                  currentItem.h),
                yStart:
                  accumulator.yStart > currentItem.y
                    ? currentItem.y
                    : accumulator.yStart,
              };
            },
            { totalMergingRowSpans: item.h, yStart: item.y }
          );

          if (totalMergingRowSpans <= subjectData.units * 2) {
            mergedItems.push({
              ...item,
              maxH: totalMergingRowSpans,
              h: totalMergingRowSpans,
              y: yStart,
            });

            mergedIds.push(
              ...yAdjacents.map((yAdjacentItem) => yAdjacentItem.i),
              item.i
            );
          }
        }
      });

      const sameLayoutItemsRemoved = layoutSource.filter((item) => {
        return !mergedIds.includes(item.i);
      });

      // console.log(subjSchedItems);

      return [
        ...sameLayoutItemsRemoved,
        ...(mergedItems.length ? mergedItems : fromDrop ? [layoutItem] : []),
      ];
    } else {
      if (fromDrop) {
        return [...layoutSource, layoutItem];
      }
    }
  }

  /**
   *
   * @param {Array} layoutSource - what layout to use
   * @param {Object} subjectData
   */

  function createRestrictions(layoutSource, subjectData) {
    const endX = 7;

    const restrictedAreas = [];
    const restrictionIds = [];

    for (let x = 1; x <= endX; x++) {
      let availableTimesY = [];
      let unavailableTimesY = [];
      let unavailableTimeYPairs = [];
      const existingSchedules =
        (subjectData?.teacher?.existingSchedules &&
          subjectData?.teacher?.existingSchedules.filter(
            (existingSchedule) => existingSchedule.day == x
          )) ||
        [];
      const inSchedulerDayTimes = subjectScheds
        .filter(
          (subjSched) =>
            subjSched.teacher.teacherId == subjectData.teacher.teacherId
        )
        .map((subj) => subj.schedules)
        .flat();
      const inSchedulerTimes = inSchedulerDayTimes
        .filter((dayTimes) => dayTimes.day == x)
        .map((dayTimes) => dayTimes.times)
        .flat();

      if (subjectData?.teacher?.type == 'part-time') {
        const preffered = subjectData?.teacher?.preferredDayTimes.find(
          (dayTimes) => dayTimes.day == x
        );

        if (preffered) {
          const preferredTimeStartIndex = timeData.findIndex((time) => {
            return (
              time[0] ==
              format(parse(preffered?.start, 'HH:mm', new Date()), 'h:mm a')
            );
          });
          const preferredTimeEndIndex = timeData.findIndex((time) => {
            return (
              time[1] ==
              format(parse(preffered?.end, 'HH:mm', new Date()), 'h:mm a')
            );
          });

          //get all the available time indexes of the teacher from preffered day start and end
          for (
            let availableY = preferredTimeStartIndex;
            availableY <= preferredTimeEndIndex;
            availableY++
          ) {
            availableTimesY.push(availableY + 1);
          }
        }
      } else if (subjectData?.teacher?.type == 'full-time') {
        availableTimesY = [...Array(timeData.length + 1).keys()].slice(1);
      }

      //get all the unavailable time indexes of the teacher based on available times
      for (
        let unavailableY = 1;
        unavailableY <= timeData.length;
        unavailableY++
      ) {
        if (!availableTimesY.includes(unavailableY)) {
          unavailableTimesY.push(unavailableY);
        }
      }

      //get all the unavailable existing schedule time indexes of the teacher
      if (existingSchedules.length) {
        existingSchedules.forEach((scheduleDays) => {
          scheduleDays.times.forEach((scheduleTime) => {
            if (
              `${course.code}${course.year}${course.section}` !==
                `${scheduleTime.course.code}${scheduleTime.course.year}${scheduleTime.course.section}` ||
              scheduleTime.subject.semester !== semester
            ) {
              const timeStartIndex = timeData.findIndex((time) => {
                return time[0] == scheduleTime.start;
              });
              const timeEndIndex = timeData.findIndex((time) => {
                return time[1] == scheduleTime.end;
              });

              for (let i = timeStartIndex; i <= timeEndIndex; i++) {
                unavailableTimesY.push(i + 1);
              }
            }
          });
        });
      }

      if (inSchedulerTimes.length) {
        inSchedulerTimes.forEach((scheduleTime) => {
          const timeStartIndex = timeData.findIndex((time) => {
            return time[0] == scheduleTime.start;
          });
          const timeEndIndex = timeData.findIndex((time) => {
            return time[1] == scheduleTime.end;
          });

          for (let i = timeStartIndex; i <= timeEndIndex; i++) {
            unavailableTimesY.push(i + 1);
          }
        });
      }

      //get all the schedule items from the same day
      let columnItemsUsedIndexes = [];
      const columnItems = layoutSource.filter(
        (item) => item.x == x && item.y !== 0
      );
      columnItems.forEach((item) => {
        for (let i = item.y; i < item.y + item.h; i++) {
          columnItemsUsedIndexes.push(i);
        }
      });

      //make the unavailableTimesY into pairs
      const duplicatesRemoved = unavailableTimesY
        .filter(
          (unavailableY) => !columnItemsUsedIndexes.includes(unavailableY)
        )
        .reduce(
          (acc, value) =>
            unavailableTimesY.indexOf(value) ===
            unavailableTimesY.lastIndexOf(value)
              ? [...acc, value]
              : acc,
          []
        )
        .sort(function (a, b) {
          return a - b;
        });
      let start = duplicatesRemoved[0];
      let prev = duplicatesRemoved[0];

      for (let i = 1; i <= duplicatesRemoved.length; i++) {
        if (duplicatesRemoved[i] === prev + 1) {
          prev = duplicatesRemoved[i];
        } else {
          unavailableTimeYPairs.push([start, prev]);
          start = duplicatesRemoved[i];
          prev = duplicatesRemoved[i];
        }
      }

      // create the restrictions
      unavailableTimeYPairs.forEach((pairs) => {
        const restrictionId = `restriction~${nanoid(10)}`;
        restrictionIds.push(restrictionId);
        restrictedAreas.push({
          i: restrictionId,
          type: 'restriction',
          x,
          y: pairs[0],
          w: 1,
          maxW: 1,
          minH: 1,
          h: Math.abs(pairs[0] - pairs[1]) + 1,
          static: true,
        });
      });
    }

    setRestrictionLayoutItemIds(restrictionIds);
    setLayout((prev) => [...prev, ...restrictedAreas]);
  }

  /**
   * removes the restrictions
   */

  function removeRestrictions() {
    setLayout((prev) =>
      prev.filter((layoutItem) => {
        return !restrictionLayouItemIds.includes(layoutItem.i);
      })
    );

    setRestrictionLayoutItemIds([]);
  }

  function handleLayoutChange(newLayout) {
    if (!isDraggingFromOutside && !isResizing && !isDragging) {
      setLayout(newLayout);
      console.log('layout changed');
    }
  }

  function onDrop(newLayout, layoutItem, _event) {
    try {
      const data = JSON.parse(_event.dataTransfer.getData('text/plain'));
      if (layoutItem.x !== 0 && layoutItem.x !== 8) {
        const nanoId = nanoid(10);
        const layoutItemId = `${data.code}~${data.teacher.teacherId}~${data.course.code}${data.course.year}${data.course.section}~${nanoId}`;

        const mergedItemsLayout = mergeYAdjacentSubjScheds(
          layout,
          {
            ...layoutItem,
            i: layoutItemId,
          },
          true
        );

        updateSubjSchedsMaxH(mergedItemsLayout, layoutItemId);
      }
    } catch (error) {
      return;
    }
  }

  function onDropDragOver() {
    //set item dragging item maxH and minH
    if (draggingSubject) {
      const { totalRowSpanCount, itemCount } = layout
        .filter((item) => {
          const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
            item.i
          );
          return subjectsData.some(
            (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
          );
        })
        .reduce(
          (accumulator, currentItem) => {
            const subjCode = currentItem.i.split('~')[0];
            if (subjCode == draggingSubject.code) {
              return {
                totalRowSpanCount: (accumulator.totalRowSpanCount +=
                  currentItem.h),
                itemCount: (accumulator.itemCount += 1),
              };
            } else {
              return accumulator;
            }
          },
          { totalRowSpanCount: 0, itemCount: 0 }
        );
      const unitsMaxSpan = draggingSubject.units * 2;
      const maxH = unitsMaxSpan - totalRowSpanCount + itemCount;

      return {
        w: 1,
        minH: 1,
        maxH,
      };
    }
  }

  function onDragStart(newLayout, layoutItem) {
    if (!isDraggingFromOutside && layoutItem.i !== '__dropping-elem__') {
      setIsDragging(true);
      const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
        layoutItem.i
      );
      const subjectData = subjectsData.find(
        (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
      )?.data;
      createRestrictions(layout, subjectData);
    }
  }

  function onDragStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    if (!isDraggingFromOutside) {
      removeRestrictions();
    }
    setIsDragging(false);
  }

  function onResizeStart(newLayout, layoutItem) {
    setIsResizing(true);
    const { subjectCode, teacherId, courseYearSec } = parseSubjSchedId(
      layoutItem.i
    );
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}~${courseYearSec}`
    )?.data;
    createRestrictions(layout, subjectData);
  }

  function onResizeStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    removeRestrictions();
    setIsResizing(false);
  }

  return (
    <ResponsiveGridLayout
      className="grid-lines h-full w-full"
      layout={layout}
      cols={headerColumns.length}
      rowHeight={40}
      maxRows={timeRows.length + 1}
      onDrop={onDrop}
      onLayoutChange={handleLayoutChange}
      resizeHandles={['s']}
      isBounded={true}
      margin={[0, 0]}
      preventCollision
      compactType={null}
      isDroppable
      onDropDragOver={onDropDragOver}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      // measureBeforeMount={true}
    >
      {headerColumns}
      {scheduleCells}
      {timeRows}
      {cellRestrictions}
    </ResponsiveGridLayout>
  );
}
