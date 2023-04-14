import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { parse, format, areIntervalsOverlapping } from 'date-fns';
import useSchedulerStore from '@/stores/useSchedulerStore';
import { MdRemove, MdMergeType, MdCallSplit } from 'react-icons/md';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { shallow } from 'zustand/shallow';
import { ImageWithFallback } from '../Misc';
import { createTimePairs } from '@/utils/time-utils';
import {
  createInitialRoomLayout,
  parseLayoutItemId,
  createLayoutItemId,
  hasEqualCourses,
  getRemainingRowSpan,
  getSubjectScheduleLayoutItems,
  createCourseSubjectSchedules,
  getMergedUsedRooms,
  createMergedClassLayout,
  createSplitMergedClassLayout,
} from '@/utils/scheduler-utils';
import { PopupLoader } from '../Loaders';
import { SchedulerLayoutItemButton } from '../Buttons';
import { Confirmation } from '../Modals';
import { toast } from 'react-hot-toast';

export default function Scheduler({
  startTime = '1:00 AM',
  endTime = '12:00 AM',
  interval = 30,
  roomData,
  semester = '',
}) {
  //   const ResponsiveGridLayout = WidthProvider(GridLayout);
  const ResponsiveGridLayout = useMemo(() => WidthProvider(GridLayout), []);
  const [layout, setLayout] = useState([]);
  const [isDraggingFromOutside, setIsDraggingFromOutside] = useState(false);
  // const [subjectsData, setSubjectsData] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMergeConfirmOpen, setIsMergeConfirmOpen] = useState(false);
  const [toMergeSchedule, setToMergeSchedule] = useState(null);
  const [toRemoveMerged, setToRemoveMerged] = useState(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isFetchingOtherRooms, setIsFetchingOtherRooms] = useState(false);
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
    roomsSubjScheds,
    setSubjectScheds,
    setRoomSubjSchedsLayout,
    setAllRoomSubjScheds,
    setAllRoomSubjSchedsLayout,
    oldSchedsData,
    setOldSchedsData,
    setSubjectsData,
    selectedRooms,
    setSelectedRooms,
    setHoveredMergeable,
    hoveredMergeable,
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
        setAllRoomSubjScheds: state.setAllRoomSubjScheds,
        setOldSchedsData: state.setOldSchedsData,
        hoveredMergeable: state.hoveredMergeable,
        setHoveredMergeable: state.setHoveredMergeable,
        selectedRooms: state.selectedRooms,
        setSelectedRooms: state.setSelectedRooms,
        roomsSubjScheds: state.roomsSubjScheds,
        setSubjectsData: state.setSubjectsData,
      }),
      []
    ),
    shallow
  );

  // memos
  const timeData = useMemo(
    () => createTimePairs(startTime, endTime, interval),
    [startTime, endTime, interval]
  );

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
          y: index,
          w: 1,
          h: 1,
          static: true,
        },
        {
          i: `${index}-${times[1]}`,
          times,
          x: headers.length,
          y: index,
          w: 1,
          h: 1,
          static: true,
        },
      ]),
    [timeData, headers.length]
  );

  //elements
  const headerColumns = headers.map((item, index) => (
    <div
      key={item.i}
      className={classNames(
        'flex h-[40px] items-center justify-center overflow-hidden whitespace-nowrap bg-white',
        `col-start-[${index}]`,
        'border-b-2 border-l border-gray-300'
      )}
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
      const { subjectCode, teacherId } = parseLayoutItemId(item.i);

      return subjectsData.some(
        (data) => data.id == `${subjectCode}~${teacherId}`
      );
    })
    .map((schedule) => {
      const { subjectCode, teacherId, courses } = parseLayoutItemId(schedule.i);
      const data = subjectsData.find((subject) => {
        return subject.id == `${subjectCode}~${teacherId}`;
      })?.data;

      let isMerging = false;

      if (hoveredMergeable) {
        const {
          subjectCode: hoveredSubjectCode,
          teacherId: hoveredTeacherId,
          courses: hoveredCourses,
        } = parseLayoutItemId(hoveredMergeable.layoutItem);
        isMerging =
          subjectCode == hoveredSubjectCode &&
          teacherId == hoveredTeacherId &&
          hasEqualCourses(courses, hoveredCourses);
      }

      const subjSchedIds = subjectsData.map((data) => data.id);
      const otherRoomLayouts = roomsSubjSchedsLayouts.filter(
        (roomLayout) => roomLayout.roomCode !== roomData.code
      );

      const subjectData = subjectsData.find(
        (data) => data.id == `${subjectCode}~${teacherId}`
      );

      const isSameSubjectAndTeacher = courseSubjects.some(
        (courseSubject) =>
          courseSubject.code == subjectCode &&
          courseSubject.assignedTeachers.some(
            (teacher) => teacher._id == teacherId
          )
      );

      const inSubjectCourses = courses.some(
        (courseItem) =>
          courseItem == `${course.code}${course.year}${course.section}`
      );

      const mergeable = isSameSubjectAndTeacher && !inSubjectCourses;

      let courseText = '';

      if (schedule.static) {
        if (courses.length > 1) {
          courseText = `${courses[0]} & ${courses.length - 1}`;
        } else {
          courseText = courses[0];
        }
      } else if (!schedule.static) {
        if (courses.length > 1 && inSubjectCourses) {
          courseText = `${course.code}${course.year}${course.section} & ${
            courses.length - 1
          }`;
        }
      }

      return (
        <div
          key={schedule.i}
          className={classNames(
            'group relative flex select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 p-2',
            {
              'border-warning-400 bg-warning-100':
                data?.teacher?.type == 'part-time' &&
                !schedule.static &&
                courses.length <= 1,
              'border-success-400 bg-success-100':
                data?.teacher?.type == 'full-time' &&
                !schedule.static &&
                courses.length <= 1,
              'border-info-400 bg-info-100':
                (!schedule.static && courses.length > 1 && inSubjectCourses) ||
                isMerging,
              'border border-gray-400 bg-gray-100': schedule.static,
            },
            {
              'cursor-default': schedule.static,
              'cursor-move': !schedule.static,
            }
          )}
        >
          {schedule.static && mergeable ? (
            <p
              className="absolute top-0 left-0 m-1 rounded-lg bg-info-500 px-1 py-[0.15rem] text-xs text-white"
              onMouseEnter={() =>
                setHoveredMergeable({
                  subjectDataId: subjectData.id,
                  layoutItem: schedule.i,
                })
              }
              onMouseLeave={() => setHoveredMergeable('')}
            >
              mergeable
            </p>
          ) : null}
          <div
            className={classNames('absolute top-0 right-0 m-1 hidden gap-1', {
              'group-hover:flex': !isResizing,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            {schedule.static && mergeable && (
              <SchedulerLayoutItemButton
                toolTipId="merge"
                toolTipContent="Merge"
                onClick={() => {
                  setToMergeSchedule(schedule);
                  setHoveredMergeable(null);
                  setIsMergeConfirmOpen(true);
                }}
                icon={<MdMergeType size={16} className="rotate-180" />}
                onMouseEnter={() =>
                  setHoveredMergeable({
                    subjectDataId: subjectData.id,
                    layoutItem: schedule.i,
                  })
                }
                onMouseLeave={() => setHoveredMergeable(null)}
              />
            )}
            {!schedule.static && courses.length > 1 && inSubjectCourses && (
              <SchedulerLayoutItemButton
                toolTipId="split"
                toolTipContent="Split"
                onClick={() => handleSplitMerge(schedule)}
                icon={<MdCallSplit size={16} />}
              />
            )}
            {!schedule.static && (
              <SchedulerLayoutItemButton
                toolTipId="remove"
                toolTipContent="Remove"
                onClick={(e) => {
                  if (courses.length > 1) {
                    setIsRemoveConfirmOpen(true);
                    setToRemoveMerged(schedule.i);
                  } else {
                    removeLayoutItem(schedule.i);
                  }
                }}
                icon={<MdRemove size={16} />}
              />
            )}
          </div>
          {schedule.h > 2 ? (
            <ImageWithFallback
              src={data?.teacher?.image}
              alt="teacher image"
              width={36}
              height={36}
              draggable={false}
              fallbackSrc="/images/default-teacher.jpg"
              className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
            />
          ) : null}
          <div className="flex flex-col text-center">
            <p
              className={classNames('font-display font-semibold uppercase', {
                'text-xs': schedule.h == 1,
                // 'text-sm': schedule.h == 2,
              })}
            >
              {data.code}
            </p>
            {schedule.h > 1 && (
              <p className="text-xs font-medium">
                {data?.teacher?.firstName} {data?.teacher?.lastName}
              </p>
            )}
          </div>
          {(schedule.static || inSubjectCourses) && (
            <p
              className={classNames(
                'max-h-[50px] overflow-hidden text-ellipsis text-center text-sm font-medium uppercase'
                // { 'text-xs': schedule.h <= 2 }
              )}
            >
              {courseText}{' '}
              {courses.length > 1 && (
                <span className="lowercase">
                  {courses.length - 1 > 1 ? 'others' : 'other'}
                </span>
              )}
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

  //for setting initial layout
  useEffect(() => {
    //get the existing room layout
    const existingRoomLayout = roomsSubjSchedsLayouts.find(
      (room) => room.roomCode == roomData.code
    );
    if (existingRoomLayout?.layout) {
      setLayout([...existingRoomLayout.layout, ...timeLayout.flat()]);
    } else {
      const initialLayout = createInitialRoomLayout(
        roomData?.schedules,
        course,
        courseSubjects,
        timeData
      );
      setLayout([...initialLayout, ...timeLayout.flat()]);
      // setRoomSubjSchedsLayout(roomData.code, roomData._id, initialLayout);
    }
  }, []);

  //create restrictions if dragging from outside
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

  //for changing subject scheds
  useEffect(
    () => {
      const subjSchedIds = subjectsData.map((data) => data.id);
      const roomLayoutItems = layout.filter((item) => {
        const { subjectCode, teacherId } = parseLayoutItemId(item.i);
        return subjSchedIds.includes(`${subjectCode}~${teacherId}`);
      });

      if (
        roomLayoutItems.length ||
        (
          roomsSubjScheds.find((room) => room.roomCode == roomData.code)
            ?.schedules || []
        )?.length
      ) {
        const roomSchedules = createCourseSubjectSchedules(
          subjSchedIds,
          roomLayoutItems,
          {
            _id: roomData._id,
            code: roomData.code,
          },
          subjectsData,
          timeData,
          course,
          selectedRooms
        );

        const otherRoomScheds = [];
        roomsSubjSchedsLayouts.forEach((roomLayout) => {
          if (roomLayout.roomCode !== roomData.code) {
            const schedules = createCourseSubjectSchedules(
              subjSchedIds,
              roomLayout.layout.filter((item) => {
                const { subjectCode, teacherId } = parseLayoutItemId(item.i);
                return subjSchedIds.includes(`${subjectCode}~${teacherId}`);
              }),
              {
                _id: roomLayout.roomId,
                code: roomLayout.roomCode,
              },
              subjectsData,
              timeData,
              course,
              selectedRooms
            );
            otherRoomScheds.push(schedules);
          }
        });

        let groupedCourseScheds = [...roomSchedules.schedules.course];
        if (otherRoomScheds.length) {
          otherRoomScheds
            .map((room) => room.schedules.course)
            .flat()
            .forEach((roomSched) => {
              //check if its in the array already
              const existingSched = groupedCourseScheds.find(
                (mergedSched) =>
                  mergedSched.subject.code == roomSched.subject.code &&
                  mergedSched.teacher._id == roomSched.teacher._id
              );
              if (!existingSched) {
                //if not existing
                groupedCourseScheds.push(roomSched);
              } else {
                //update the subject to add the schedule
                const merged = {
                  ...existingSched,
                  schedules: [
                    ...existingSched.schedules.filter(
                      (exist) => exist.room.code == roomData.code
                    ),
                    ...roomSched.schedules.filter(
                      (sched) => sched.room.code !== roomData.code
                    ),
                  ],
                };

                //filter the grouped scheds to remove the old subject data
                groupedCourseScheds = [
                  ...groupedCourseScheds.filter((mergedSched) => {
                    return (
                      mergedSched.subject.code !== merged.subject.code &&
                      mergedSched.teacher._id !== merged.teacher._id
                    );
                  }),
                  merged,
                ];
              }
            });
        }

        const updatedRoomSchedules = [
          {
            ...roomSchedules,
            schedules: [
              ...roomSchedules.schedules.course,
              ...roomSchedules.schedules.other,
            ],
          },
          ...otherRoomScheds.map((otherRoom) => ({
            ...otherRoom,
            schedules: [
              ...otherRoom.schedules.course,
              ...otherRoom.schedules.other,
            ],
          })),
        ];

        const subjSchedItems = layout.filter((item) => {
          const { subjectCode, teacherId } = parseLayoutItemId(item.i);
          return subjSchedIds.includes(`${subjectCode}~${teacherId}`);
        });
        setSubjectScheds(groupedCourseScheds);
        setAllRoomSubjScheds(_.sortBy(updatedRoomSchedules, 'roomCode'));
        setRoomSubjSchedsLayout(roomData.code, roomData._id, subjSchedItems);
        if (!oldSchedsData.length && updatedRoomSchedules.length) {
          setOldSchedsData(_.sortBy(updatedRoomSchedules, 'roomCode'));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout, subjectsData, timeData, roomData]
  );

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

  function updateSubjSchedsMaxH(
    layoutSource,
    layoutItemId,
    roomLayouts = roomsSubjSchedsLayouts
  ) {
    //parse layoutItemId
    const { subjectCode, teacherId, courses } = parseLayoutItemId(layoutItemId);
    //get the subject data ids
    const subjSchedIds = subjectsData.map((data) => data.id);

    //get the layout from other rooms
    const otherRoomLayouts = roomLayouts.filter(
      (roomLayout) => roomLayout.roomCode !== roomData.code
    );
    //get the subject's data
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    )?.data;

    //if there is a subject data update all the maxH of the same subject from the same course year and section
    if (subjectData) {
      const { roomItems, subjectLayoutItems } = getSubjectScheduleLayoutItems(
        subjectCode,
        teacherId,
        layoutSource,
        otherRoomLayouts,
        subjSchedIds,
        course
      );

      const remainingRowSpan = getRemainingRowSpan(
        subjectData.units,
        subjectLayoutItems
      );

      const updatedSubjSchedItems = subjectLayoutItems.map((item) => ({
        ...item,
        maxH: remainingRowSpan + item.h,
      }));

      // update the layout items of other rooms
      const updatedRoomLayouts = otherRoomLayouts.map((roomLayout) => ({
        roomCode: roomLayout.roomCode,
        roomId: roomLayout.roomId,
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
        roomId: roomData._id,
        layout: [
          ...roomItems.filter(
            (item) =>
              !updatedSubjSchedItems.some(
                (updatedItem) => updatedItem.i == item.i
              )
          ),
          ...updatedSubjSchedItems.filter((updatedItem) =>
            roomItems.some((item) => updatedItem.i == item.i)
          ),
        ],
      };
      setAllRoomSubjSchedsLayout([newRoomLayout, ...updatedRoomLayouts]);
      setLayout([...newRoomLayout.layout, ...timeLayout.flat()]);
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
    const { subjectCode, teacherId, courses } = parseLayoutItemId(layoutItem.i);
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    )?.data;
    if (subjectData) {
      const subjSchedItems = layoutSource.filter((item) => {
        const {
          subjectCode: itemSubjCode,
          teacherId: itemTeacherId,
          courses: itemCourses,
        } = parseLayoutItemId(item.i);
        return (
          subjectCode == itemSubjCode &&
          teacherId == itemTeacherId &&
          hasEqualCourses(courses, itemCourses)
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

  function createRestrictions(layoutSource, subjectData, layoutItem) {
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

      const inSchedulerDayTimes = roomsSubjScheds
        .map((room) => room.schedules)
        .flat()
        .filter((subjSched) =>
          subjSched.schedules.some((schedule) =>
            schedule.times.some((time) =>
              time.courses.some(
                (timeCourse) =>
                  timeCourse.code == course.code &&
                  timeCourse.year == course.year &&
                  timeCourse.section == course.section
              )
            )
          )
        )
        .map((subj) => subj.schedules)
        .flat();

      const teacherInSchedulerDayTimes = roomsSubjScheds
        .map((room) => room.schedules)
        .flat()
        .filter((subjSched) => subjSched.teacher._id == subjectData.teacher._id)
        .map((subj) => subj.schedules)
        .flat()
        .filter((sched) => sched.room._id !== roomData._id);

      const inSchedulerTimes = inSchedulerDayTimes
        .filter((dayTimes) => dayTimes.day == x)
        .map((dayTimes) => dayTimes.times)
        .flat();

      const teacherInSchedulerTimes = teacherInSchedulerDayTimes
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
            availableTimesY.push(availableY);
          }
        }
      } else if (subjectData?.teacher?.type == 'full-time') {
        availableTimesY = [...Array(timeData.length).keys()];
      }

      //get all the unavailable time indexes of the teacher based on available times
      for (
        let unavailableY = 0;
        unavailableY < timeData.length;
        unavailableY++
      ) {
        if (!availableTimesY.includes(unavailableY)) {
          unavailableTimesY.push(unavailableY);
        }
      }

      //get all the unavailable existing schedule time indexes of the teacher
      if (existingSchedules.length) {
        // let parsedLayoutItemId = null;
        // if (layoutItem) {
        //   parsedLayoutItemId = parseLayoutItemId(layoutItem.i);
        // }

        existingSchedules.forEach((existingSchedule) => {
          //should exclude checking of existing times when is merged with the currently editing course
          if (
            existingSchedule.room.code !== roomData.code &&
            !selectedRooms.some(
              (room) => room.code == existingSchedule.room.code
            )
          ) {
            existingSchedule.times.forEach((scheduleTime) => {
              const subject = subjectScheds.find(
                (subj) => subj.subject.code == scheduleTime.subject.code
              );

              let coursesExist = false;
              if (subject && scheduleTime) {
                const scheduleTimeCourses = scheduleTime.courses.map(
                  (schedTimeCourse) =>
                    `${schedTimeCourse.code}${schedTimeCourse.year}${schedTimeCourse.section}`
                );

                coursesExist = subject.schedules.some((schedule) => {
                  return schedule.times.some((time) => {
                    return time.courses.some((course) => {
                      return scheduleTimeCourses.includes(course);
                    });
                  });
                });
              }
              if (
                !scheduleTime.courses.some(
                  (scheduleCourse) =>
                    `${course.code}${course.year}${course.section}` ==
                    `${scheduleCourse.code}${scheduleCourse.year}${scheduleCourse.section}`
                ) &&
                // !(
                //   parsedLayoutItemId &&
                //   parsedLayoutItemId.courses.some(
                //     (itemCourse) =>
                //       itemCourse ==
                //       `${course.code}${course.year}${course.section}`
                //   )
                // ) &&
                !coursesExist
              ) {
                const timeStartIndex = timeData.findIndex((time) => {
                  return time[0] == scheduleTime.start;
                });
                const timeEndIndex = timeData.findIndex((time) => {
                  return time[1] == scheduleTime.end;
                });

                for (let i = timeStartIndex; i <= timeEndIndex; i++) {
                  if (!unavailableTimesY.includes(i)) unavailableTimesY.push(i);
                }
              }
            });
          }
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
            if (!unavailableTimesY.includes(i)) unavailableTimesY.push(i);
          }
        });
      }

      if (teacherInSchedulerTimes.length) {
        teacherInSchedulerTimes.forEach((scheduleTime) => {
          const timeStartIndex = timeData.findIndex((time) => {
            return time[0] == scheduleTime.start;
          });
          const timeEndIndex = timeData.findIndex((time) => {
            return time[1] == scheduleTime.end;
          });

          for (let i = timeStartIndex; i <= timeEndIndex; i++) {
            if (!unavailableTimesY.includes(i)) unavailableTimesY.push(i);
          }
        });
      }

      // console.log('Y', unavailableTimesY);

      //get all the schedule items from the same day
      let columnItemsUsedIndexes = [];
      const columnItems = layoutSource.filter((item) => item.x == x);
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

      for (let i = 0; i < duplicatesRemoved.length; i++) {
        const start = duplicatesRemoved[i];
        let end = start;

        while (
          i < duplicatesRemoved.length - 1 &&
          duplicatesRemoved[i + 1] === end + 1
        ) {
          end++;
          i++;
        }

        unavailableTimeYPairs.push([start, end]);
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

  async function getMergedClassRooms(toFetchOtherRooms) {
    try {
      let newSelectedRooms = [...selectedRooms];
      let newRoomLayouts = [...roomsSubjSchedsLayouts];
      if (toFetchOtherRooms.length) {
        const results = await Promise.all(
          toFetchOtherRooms.map((room) =>
            fetch(`/api/rooms/${room}?p=scheduler&semester=${semester}`)
              .then((res) => res.json())
              .catch((error) => console.error(error))
          )
        );
        results.forEach((result) => newSelectedRooms.push(result.data[0]));
        // if room doesnt have a layout saved
        newSelectedRooms.forEach((room) => {
          const roomLayout = createInitialRoomLayout(
            room.schedules,
            course,
            courseSubjects,
            timeData
          );
          newRoomLayouts.push({
            roomCode: room.code,
            roomId: room._id,
            layout: roomLayout,
          });
        });
      }
      setIsFetchingOtherRooms(false);
      setSelectedRooms(newSelectedRooms);
      setAllRoomSubjSchedsLayout(newRoomLayouts);

      return {
        newSelectedRooms,
        newRoomLayouts,
      };
    } catch (error) {
      console.error(error);
      setIsFetchingOtherRooms(false);
    }
  }

  async function onConfirmMerge() {
    setIsMergeConfirmOpen(false);
    const { subjectCode, teacherId } = parseLayoutItemId(toMergeSchedule.i);
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    );
    const toFetchOtherRooms = getMergedUsedRooms(
      subjectData.data,
      selectedRooms
    );
    const { newRoomLayouts } = await getMergedClassRooms(toFetchOtherRooms);
    handleClassMerge(toMergeSchedule, newRoomLayouts);
  }

  // add a function to check if merge is possible
  // by checking if there is no conflict
  function handleClassMerge(layoutItem, roomLayouts) {
    let couldMerge = true;

    const { subjectCode, teacherId, courses } = parseLayoutItemId(layoutItem.i);
    const newItemId = createLayoutItemId(subjectCode, teacherId, [
      ...courses,
      `${course.code}${course.year}${course.section}`,
    ]);

    const inSchedulerDayTimes = subjectScheds
      .map((subj) => subj.schedules)
      .flat();

    const mergingLayoutItems = roomLayouts
      .map((room) => room.layout)
      .flat()
      .filter((item) => {
        const {
          subjectCode: itemSubjCode,
          teacherId: itemTeacherId,
          courses: itemCourses,
        } = parseLayoutItemId(item.i);
        return (
          subjectCode == itemSubjCode &&
          teacherId == itemTeacherId &&
          hasEqualCourses(courses, itemCourses)
        );
      });

    const mergingSchedules = mergingLayoutItems.map((item) => ({
      day: item.x,
      start: timeData[item.y][0],
      end: timeData[item.y + item.h - 1][1],
    }));

    let day = 1;
    while (day <= 7 && couldMerge) {
      const inScheduler = inSchedulerDayTimes.filter(
        (schedule) => schedule.day == day
      );
      const inMerging = mergingSchedules.filter(
        (schedule) => schedule.day == day
      );

      inScheduler.forEach((schedule) => {
        schedule.times.forEach((time) => {
          const interval1Start = parse(time.start, 'hh:mm a', new Date());
          const interval1End = parse(time.end, 'hh:mm a', new Date());
          inMerging.forEach((mergingTime) => {
            const interval2Start = parse(
              mergingTime.start,
              'hh:mm a',
              new Date()
            );
            const interval2End = parse(mergingTime.end, 'hh:mm a', new Date());

            const areOverlapping = areIntervalsOverlapping(
              { start: interval1Start, end: interval1End },
              { start: interval2Start, end: interval2End }
            );

            if (areOverlapping) {
              // break the outer loop
              couldMerge = false;
              return;
            }
          });
        });
      });

      day++;
    }

    if (couldMerge) {
      const subjectData = subjectsData.find(
        (data) => data.id == `${subjectCode}~${teacherId}`
      );

      const newLayoutItem = { ...layoutItem, i: newItemId, static: false };

      const mergedItemsLayout = mergeYAdjacentSubjScheds(
        createMergedClassLayout(layout, layoutItem, course),
        newLayoutItem
      );

      const subjSchedIds = subjectsData.map((data) => data.id);
      let updatedOtherRoomLayouts = [
        {
          roomCode: roomData.code,
          roomId: roomData._id,
          layout: mergedItemsLayout.filter((item) => {
            const { subjectCode: itemSubjectCode, teacherId: itemTeacherId } =
              parseLayoutItemId(item.i);
            return subjSchedIds.includes(`${itemSubjectCode}~${itemTeacherId}`);
          }),
        },
      ];

      roomLayouts.forEach((room) => {
        if (room.roomId !== roomData._id) {
          const newLayout = createMergedClassLayout(
            room.layout,
            layoutItem,
            course
          );
          updatedOtherRoomLayouts.push({
            roomId: room.roomId,
            roomCode: room.roomCode,
            layout: newLayout,
          });
        }
      });

      const newSubjectData = {
        ...subjectData,
        data: {
          ...subjectData.data,
          teacher: {
            ...subjectData.data.teacher,
            assignedCourses: subjectData.data.courses.filter((itemCourse) => {
              return [
                ...courses,
                `${course.code}${course.year}${course.section}`,
              ].includes(
                `${itemCourse.code}${itemCourse.year}${itemCourse.section}`
              );
            }),
          },
        },
      };

      setSubjectsData([
        ...subjectsData.filter((data) => data.id !== newSubjectData.id),
        newSubjectData,
      ]);

      updateSubjSchedsMaxH(
        mergedItemsLayout,
        newItemId,
        updatedOtherRoomLayouts
      );
    } else {
      toast.error("Can't merge class schedule due to conflicts!");
    }
  }

  function handleSplitMerge(layoutItem) {
    const { subjectCode, teacherId, courses } = parseLayoutItemId(layoutItem.i);
    const newItemId = createLayoutItemId(
      subjectCode,
      teacherId,
      courses.filter(
        (courseYearSec) =>
          courseYearSec !== `${course.code}${course.year}${course.section}`
      )
    );

    const newLayoutItem = { ...layoutItem, i: newItemId, static: true };

    const mergedItemsLayout = mergeYAdjacentSubjScheds(
      createSplitMergedClassLayout(layout, layoutItem, course),
      newLayoutItem
    );

    const subjSchedIds = subjectsData.map((data) => data.id);

    let updatedOtherRoomLayouts = [
      {
        roomCode: roomData.code,
        roomId: roomData._id,
        layout: mergedItemsLayout.filter((item) => {
          const { subjectCode: itemSubjectCode, teacherId: itemTeacherId } =
            parseLayoutItemId(item.i);
          return subjSchedIds.includes(`${itemSubjectCode}~${itemTeacherId}`);
        }),
      },
    ];

    roomsSubjSchedsLayouts.forEach((room) => {
      if (room.roomId !== roomData._id) {
        const newLayout = createSplitMergedClassLayout(
          room.layout,
          layoutItem,
          course
        );
        updatedOtherRoomLayouts.push({
          roomId: room.roomId,
          roomCode: room.roomCode,
          layout: newLayout,
        });
      }
    });

    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    );
    const newSubjectData = {
      ...subjectData,
      data: {
        ...subjectData.data,
        teacher: {
          ...subjectData.data.teacher,
          assignedCourses: subjectData.data.teacher.assignedCourses.filter(
            (assignedCourse) =>
              assignedCourse.code !== course.code ||
              assignedCourse.year !== course.year ||
              assignedCourse.section !== course.section
          ),
        },
      },
    };
    setSubjectsData([
      ...subjectsData.filter((data) => data.id !== newSubjectData.id),
      newSubjectData,
    ]);

    updateSubjSchedsMaxH(mergedItemsLayout, newItemId, updatedOtherRoomLayouts);
  }

  function handleLayoutChange(newLayout) {
    if (!isDraggingFromOutside && !isResizing && !isDragging) {
      setLayout(newLayout);
      console.log('layout changed');
    }
  }

  //needs attention
  function onDrop(newLayout, layoutItem, _event) {
    try {
      const subjectDataId = JSON.parse(
        _event.dataTransfer.getData('text/plain')
      );

      const data = subjectsData.find(
        (subjectsData) => subjectsData.id == subjectDataId.id
      )?.data;

      let itemCourses = [`${course.code}${course.year}${course.section}`];
      if (
        data?.teacher?.assignedCourses.some(
          (assignedCourse) =>
            `${assignedCourse.code}${assignedCourse.year}${assignedCourse.section}` ==
            itemCourses[0]
        )
      ) {
        data?.teacher?.assignedCourses.forEach((dataCourse) => {
          const toStringCourse = `${dataCourse.code}${dataCourse.year}${dataCourse.section}`;
          if (!itemCourses.includes(toStringCourse)) {
            itemCourses.push(toStringCourse);
          }
        });
      }
      if (layoutItem.x !== 0 && layoutItem.x !== 8) {
        const layoutItemId = createLayoutItemId(
          data.code,
          data.teacher._id,
          itemCourses
        );

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

  //needs attention
  function onDropDragOver() {
    //set item dragging item maxH and minH
    if (draggingSubject) {
      const { totalRowSpanCount, itemCount } = layout
        .filter((item) => {
          const { subjectCode, teacherId, courses } = parseLayoutItemId(item.i);
          return (
            subjectsData.some(
              (data) => data.id == `${subjectCode}~${teacherId}`
            ) &&
            courses.includes(`${course.code}${course.year}${course.section}`)
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
      const { subjectCode, teacherId } = parseLayoutItemId(layoutItem.i);
      const subjectData = subjectsData.find(
        (data) => data.id == `${subjectCode}~${teacherId}`
      )?.data;
      createRestrictions(layout, subjectData, layoutItem);
    }
  }

  function onDragStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    // if (!isDraggingFromOutside) {
    removeRestrictions();
    // }
    setIsDragging(false);
  }

  function onResizeStart(newLayout, layoutItem) {
    setIsResizing(true);
    const { subjectCode, teacherId } = parseLayoutItemId(layoutItem.i);
    updateSubjSchedsMaxH(newLayout, layoutItem.i);
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    )?.data;
    createRestrictions(layout, subjectData, layoutItem);
  }

  function onResizeStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    removeRestrictions();
    setIsResizing(false);
  }

  return (
    <div className="min-w-[900px]">
      <PopupLoader
        isOpen={isFetchingOtherRooms}
        message="Getting the rooms used by the merged class and their schedules..."
      />
      <Confirmation
        isOpen={isMergeConfirmOpen}
        onCancel={() => {
          setIsMergeConfirmOpen(false);
          setToMergeSchedule(null);
        }}
        onConfirm={onConfirmMerge}
        label="Merge Subject Schedules?"
        message="This will remove all placed individual same subject and teacher schedules of the current class."
      />
      <Confirmation
        isOpen={isRemoveConfirmOpen}
        onCancel={() => {
          setIsRemoveConfirmOpen(false);
          setToRemoveMerged('');
        }}
        onConfirm={() => {
          removeLayoutItem(toRemoveMerged);
          setToRemoveMerged('');
          setIsRemoveConfirmOpen(false);
        }}
        label="Remove Merged Class Schedule?"
        message="It will also remove the schedule from the other classes"
      />
      <div className="sticky top-0 z-[1] grid h-[40px] grid-cols-9 grid-rows-1">
        {headerColumns}
      </div>
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
        // allowOverlap={allowMerging}
        isDroppable
        onDropDragOver={onDropDragOver}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
      >
        {/* {headerColumns} */}
        {scheduleCells}
        {timeRows}
        {cellRestrictions}
      </ResponsiveGridLayout>
    </div>
  );
}
