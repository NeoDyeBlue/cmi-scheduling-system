import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { parse, format, addMinutes } from 'date-fns';
import useSchedulerStore from '@/stores/useSchedulerStore';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

/**
 * @todo remove placed scheds
 * @todo show subject scheds from the same room
 * @todo fix grid responsiveness
 * @todo check if drop, drag,or resizing of schedules is valid by creating restrictions
 * @todo restrict dropping of other elements to the table
 */

export default function Scheduler({
  startTime = '1:00 AM',
  endTime = '12:00 AM',
  interval = 30,
  initialLayout = [],
}) {
  //   const ResponsiveGridLayout = WidthProvider(GridLayout);
  const ResponsiveGridLayout = useMemo(() => WidthProvider(GridLayout), []);
  const [layout, setLayout] = useState(initialLayout);
  const [isDraggingFromOutside, setIsDraggingFromOutside] = useState(false);
  const [subjectsData, setSubjectsData] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [restrictionLayouItemIds, setRestrictionLayoutItemIds] = useState([]);
  const [scheduleLayout, setScheduleLayout] = useState([]);

  //stores
  const { draggingSubject, setSubjectScheds, subjectScheds } =
    useSchedulerStore();

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
          i: `${index}${nanoid(10)}`,
          times,
          x: 0,
          y: index + 1,
          w: 1,
          h: 1,
          static: true,
        },
        {
          i: `${index}${nanoid(11)}`,
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
      const { subjectCode, teacherId } = parseSubjSchedId(item.i);
      return subjectsData.some(
        (data) => data.id == `${subjectCode}~${teacherId}`
      );
    })
    .map((schedule) => {
      // <SchedulerSchedItem key={schedule.i} data={schedule.data} />
      const data = subjectsData.find((subject) => {
        const { subjectCode, teacherId } = parseSubjSchedId(schedule.i);
        return subject.id == `${subjectCode}~${teacherId}`;
      })?.data;

      return (
        <div
          key={schedule.i}
          className={classNames(
            'flex cursor-move select-none flex-col items-center justify-center overflow-hidden rounded-lg border p-2',
            {
              'border-warning-400 bg-warning-100':
                data?.teacher?.type == 'part-time',
              'border-success-400 bg-success-100':
                data?.teacher?.type == 'full-time',
            }
          )}
        >
          <div className="flex flex-col text-center">
            <p className="font-display font-semibold">{data.code}</p>
          </div>
          <div className="flex flex-col text-center">
            <p className="text-xs font-medium">
              {data?.teacher?.firstName} {data?.teacher?.lastName}
            </p>
          </div>
        </div>
      );
    });

  const cellRestrictions = layout
    .filter((item) => {
      return restrictionLayouItemIds.includes(item.i);
    })
    .map((restriction) => {
      // <SchedulerSchedItem key={schedule.i} data={schedule.data} />

      return <div key={restriction.i} className="bg-gray-500/50"></div>;
    });

  //effects
  useEffect(() => {
    if (draggingSubject) {
      createRestrictions(layout, draggingSubject);
      setIsDraggingFromOutside(true);
    } else {
      removeRestrictions();
      setIsDraggingFromOutside(false);
    }
  }, [draggingSubject]);

  useEffect(() => {
    const subjSchedIds = subjectsData.map((data) => data.id);
    const subjSchedItems = layout.filter((item) => {
      const { subjectCode, teacherId } = parseSubjSchedId(item.i);
      return subjSchedIds.includes(`${subjectCode}~${teacherId}`);
    });

    setScheduleLayout(subjSchedItems);

    const subjSchedIdsParsed = subjSchedIds.map((id) => {
      const { subjectCode, teacherId } = parseSubjSchedId(id);
      return { code: subjectCode, teacher: teacherId };
    });
    const newSubjectScheds = [];
    //for each schedIds
    subjSchedIdsParsed.forEach(({ code, teacher }) => {
      //get the subject layout items from subject code
      const subjSchedLayoutItems = subjSchedItems.filter(
        (item) => item.i.split('~')[0] == code
      );
      //set the subject's times and days
      const schedules = subjSchedLayoutItems.map((layout) => ({
        teacherId: teacher,
        day: layout.x,
        time: {
          start: timeData[layout.y - 1][0],
          end: timeData[layout.y - 1 + layout.h - 1][1],
        },
      }));
      //add to the sched array
      newSubjectScheds.push({
        subjectCode: code,
        schedules,
      });
    });
    setSubjectScheds(newSubjectScheds);
  }, [layout, subjectsData, timeData, setSubjectScheds]);

  //other funcs
  function parseSubjSchedId(id, separator = '~') {
    const [subjectCode, teacherId, nanoId] = id.split(separator);
    return { subjectCode, teacherId, nanoId };
  }

  /**
   *
   * @param {Array} layoutSource - what layout to use
   * @param {String} layoutItemId - the layout "i" in SUBJCODE~##-####~nanoId format
   */

  function updateSubjSchedsMaxH(layoutSource, layoutItemId) {
    const { subjectCode, teacherId } = parseSubjSchedId(layoutItemId);
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    )?.data;
    if (subjectData) {
      const unitsMaxSpan = subjectData.units * 2;
      const subjSchedItems = layoutSource.filter((item) => {
        const { subjectCode: itemSubjCode } = parseSubjSchedId(item.i);
        return subjectCode == itemSubjCode;
      });

      // if (fromDrop) {
      //   subjSchedItems.push({
      //     ...layoutItem,
      //   });
      // }

      const { totalRowSpanCount, itemCount } = subjSchedItems.reduce(
        (accumulator, currentItem) => {
          return {
            totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
            itemCount: (accumulator.itemCount += 1),
          };
        },
        { totalRowSpanCount: 0, itemCount: 0 }
      );

      const remainingRowSpan = unitsMaxSpan - totalRowSpanCount;

      // console.log(remainingRowSpan - itemCount);

      const updatedSubjSchedItems = subjSchedItems.map((item) => ({
        ...item,
        i: item.i,
        // formula here needs more tests
        maxH: remainingRowSpan + item.h,
      }));

      const sameLayoutItemsRemoved = layoutSource.filter((item) => {
        return !updatedSubjSchedItems.some(
          (subjSchedItem) => subjSchedItem.i == item.i
        );
      });

      setLayout([...sameLayoutItemsRemoved, ...updatedSubjSchedItems]);
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
    const { subjectCode, teacherId } = parseSubjSchedId(layoutItem.i);
    const subjectData = subjectsData.find(
      (data) => data.id == `${subjectCode}~${teacherId}`
    )?.data;
    if (subjectData) {
      const subjSchedItems = layoutSource.filter((item) => {
        const { subjectCode: itemSubjCode } = parseSubjSchedId(item.i);
        return subjectCode == itemSubjCode;
      });

      if (fromDrop) {
        subjSchedItems.push({
          ...layoutItem,
        });
      }

      const { totalRowSpanCount } = subjSchedItems.reduce(
        (accumulator, currentItem) => {
          return {
            totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
            itemCount: (accumulator.itemCount += 1),
          };
        },
        { totalRowSpanCount: 0, itemCount: 0 }
      );

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

        // console.log(yAdjacents, item.y);

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
          // console.table({
          //   totalMergingRowSpans,
          //   totalRowSpanCount,
          //   yStart,
          //   itemH: item.h,
          //   shouldMerge: totalRowSpanCount % totalMergingRowSpans == 0,
          //   mergeValue: totalRowSpanCount % totalMergingRowSpans,
          // });
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

  function createRestrictions(layoutSource, subjectData) {
    const endX = 7;

    const restrictedAreas = [];
    const restrictionIds = [];

    if (subjectData?.teacher?.type == 'part-time') {
      //for every day of the week
      for (let x = 1; x <= endX; x++) {
        const preffered = subjectData?.teacher?.preferredDayTimes.find(
          (dayTimes) => dayTimes.day == x - 1
        );

        //if the day is preffered
        if (preffered) {
          const availableTimesY = [];
          const unavailableTimesY = [];
          const unavailableTimeYPairs = [];
          const existingScheduleTimes =
            subjectData?.teacher?.existingSchedules.find(
              (existingSchedule) => existingSchedule.day == preffered.day
            )?.times || [];

          const preferredTimeStartIndex = timeData.findIndex((time) => {
            return time[0] == preffered?.time?.start;
          });
          const preferredTimeEndIndex = timeData.findIndex((time) => {
            return time[1] == preffered?.time?.end;
          });

          //get all the available time indexes of the teacher from preffered day start and end
          for (
            let availableY = preferredTimeStartIndex;
            availableY <= preferredTimeEndIndex;
            availableY++
          ) {
            availableTimesY.push(availableY + 1);
          }
          //get all the unavailable time indexes of the teacher
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
          if (existingScheduleTimes.length) {
            existingScheduleTimes.forEach((scheduleTime) => {
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
          const columnItems = layoutSource.filter(
            (item) => item.x == x && item.y !== 0
          );
          columnItems.forEach((item) => {
            for (let i = item.y; i < item.y + item.h; i++) {
              unavailableTimesY.push(i);
            }
          });

          //make the unavailableTimesY into pairs
          const duplicatesRemoved = unavailableTimesY
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
      }
    }

    setRestrictionLayoutItemIds(restrictionIds);
    setLayout((prev) => [...prev, ...restrictedAreas]);
  }

  function removeRestrictions() {
    setLayout((prev) =>
      prev.filter((layoutItem) => {
        return !restrictionLayouItemIds.includes(layoutItem.i);
      })
    );

    setRestrictionLayoutItemIds([]);
  }

  function onDrop(newLayout, layoutItem, _event) {
    const data = JSON.parse(_event.dataTransfer.getData('text/plain'));
    if (layoutItem.x !== 0 && layoutItem.x !== 8) {
      const nanoId = nanoid(10);
      const layoutItemId = `${data.code}~${data.teacher.id}~${nanoId}`;
      const dataId = `${data.code}~${data.teacher.id}`;

      const mergedItemsLayout = mergeYAdjacentSubjScheds(
        layout,
        {
          ...layoutItem,
          i: layoutItemId,
        },
        true
      );

      updateSubjSchedsMaxH(mergedItemsLayout, layoutItemId);

      // setLayout((prev) => [
      //   ...prev,
      //   {
      //     ...layoutItem,
      //     i: layoutItemId,
      //   },
      // ]);
      if (!subjectsData.some((data) => data.id == dataId)) {
        setSubjectsData((prev) => [
          ...prev,
          {
            id: dataId,
            data,
          },
        ]);
      }
    }
  }

  function handleLayoutChange(newLayout) {
    if (!isDraggingFromOutside && !isResizing && !isDragging) {
      setLayout(newLayout);
      console.log('layout changed');
    }
  }

  function onDropDragOver() {
    //set item dragging item maxH and minH
    const { totalRowSpanCount, itemCount } = scheduleLayout.reduce(
      (accumulator, currentItem) => {
        const subjCode = currentItem.i.split('~')[0];
        if (subjCode == draggingSubject.code) {
          return {
            totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
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

  function onDragStart(newLayout, layoutItem) {
    // console.log(layoutItem);
    setIsDragging(true);
  }

  function onDragStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    setIsDragging(false);
  }

  function onResizeStart() {
    setIsResizing(true);
  }

  function onResizeStop(newLayout, layoutItem) {
    const mergedItemsLayout = mergeYAdjacentSubjScheds(newLayout, layoutItem);
    updateSubjSchedsMaxH(mergedItemsLayout, layoutItem.i);
    setIsResizing(false);
  }

  return (
    <ResponsiveGridLayout
      className="grid-lines w-full border-r border-b border-gray-200"
      layout={layout.length ? layout : [...headers, ...timeLayout.flat()]}
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
    >
      {headerColumns}
      {scheduleCells}
      {timeRows}
      {cellRestrictions}
    </ResponsiveGridLayout>
  );
}
