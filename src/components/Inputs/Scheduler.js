import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { parse, format, addMinutes } from 'date-fns';
import useSchedulerStore from '@/stores/useSchedulerStore';
import classNames from 'classnames';

/**
 * @todo update the maxH of the subjectScheds before or after the same subjectSched is dropped, dragged, or resized
 * @todo merge subjects if applicable or is in the same column and adjacent Y
 * @todo disable dragging if complete
 * @todo remove placed scheds
 * @todo show subject scheds from the same room
 * @todo fix grid responsiveness
 * @todo check if drop, drag,or resizing of schedules is valid by creating restrictions
 * @todo update time left for the placed subject schedules
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
  const [schedulesData, setSchedulesData] = useState([]);
  const [scheduleLayout, setScheduleLayout] = useState([]);

  //stores
  const { draggingSubject, setSubjectScheds, subjectScheds } =
    useSchedulerStore();

  const timeData = useMemo(() => {
    const start = parse(startTime, 'hh:mm a', new Date());
    const end = parse(endTime, 'hh:mm a', new Date());

    let current = start;
    const times = [];

    while (current <= end) {
      times.push(format(current, 'h:mm a'));
      current = addMinutes(current, interval);
    }

    return times;
  }, [startTime, endTime, interval]);

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
      timeData.map((time, index) => [
        {
          i: `${index}${time}`,
          name: time,
          x: 0,
          y: index + 1,
          w: 1,
          h: 1,
          static: true,
        },
        {
          i: `${index}${index}${time}`,
          name: time,
          x: headers.length,
          y: index + 1,
          w: 1,
          h: 1,
          static: true,
        },
      ]),
    [timeData, headers.length]
  );

  const headerColumns = headers.map((header) => (
    <div
      key={header.i}
      className="flex items-center justify-center font-display text-xs font-semibold capitalize"
    >
      {header.name}
    </div>
  ));

  const timeRows = timeLayout.flat().map((time) => (
    <div
      key={time.i}
      className="flex items-center justify-center text-xs capitalize"
    >
      {time.name}
    </div>
  ));

  const scheduleCells = schedulesData.map((schedule) => {
    // <SchedulerSchedItem key={schedule.i} data={schedule.data} />
    const data = schedule.data;

    return (
      <div
        key={schedule.id}
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

  //effects
  useEffect(
    () => setIsDraggingFromOutside(draggingSubject ? true : false),
    [draggingSubject]
  );

  useEffect(() => {
    const scheduleIds = schedulesData.map((scheduleData) => scheduleData.id);
    const scheduleItems = layout.filter((item) => scheduleIds.includes(item.i));
    setScheduleLayout(scheduleItems);

    //set new sched data
    const scheduleIdsCountRemoved = scheduleIds.reduce((accumulator, item) => {
      const [code, teacher] = item.split('_');
      if (
        !accumulator.some((obj) => obj.code == code && obj.teacher == teacher)
      ) {
        return [...accumulator, { code, teacher }];
      } else {
        return accumulator;
      }
    }, []);
    const newSubjectScheds = [];
    //for each schedIds
    scheduleIdsCountRemoved.forEach(({ code, teacher }) => {
      //get the subject layout items from subject code
      const subjLayoutItems = scheduleItems.filter(
        (item) => item.i.split('_')[0] == code
      );
      //set the subject's times and days
      const schedules = subjLayoutItems.map((layout) => ({
        teacherId: teacher,
        day: layout.x,
        time: {
          start: timeData[layout.y - 1],
          end: timeData[layout.y - 1 + layout.h - 1],
        },
      }));
      //add to the sched array
      newSubjectScheds.push({
        subjectCode: code,
        schedules,
      });
    });
    setSubjectScheds(newSubjectScheds);
  }, [layout, schedulesData, timeData, setSubjectScheds]);

  function createRestrictions() {
    const startX = 1;
    const endX = 7;
    const startY = 1;
    const endY = timeData.length;

    let restrictedAreas = [];
    let allowedAreas = [];

    if (draggingSubject.teacher.type == 'part-time') {
      draggingSubject.teacher.prefferedDayTimes.forEach(daytime);
    }

    for (let index = 1; index <= endX; index++) {}
  }

  function onDrop(newLayout, layoutItem, _event) {
    const data = JSON.parse(_event.dataTransfer.getData('text/plain'));
    if (layoutItem.x !== 0 && layoutItem.x !== 8) {
      //get the count of placed same subject
      const count = scheduleLayout.reduce((accumulator, currentItem) => {
        const subjCode = currentItem.i.split('_')[0];
        if (subjCode == data.code) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      }, 1);

      const id = `${data.code}_${data.teacher.id}_${count}`;

      setLayout((prev) => [
        ...prev,
        {
          ...layoutItem,
          i: id,
        },
      ]);
      setSchedulesData((prev) => [
        ...prev,
        {
          id,
          data,
        },
      ]);
    }
  }

  function handleLayoutChange(newLayout) {
    if (!isDraggingFromOutside) {
      // let mergedLayout = [];
      // const scheduleIds = schedulesData.map((scheduleData) => scheduleData.id);
      // scheduleIds.forEach((id) => {
      //   const subjCode = id.split('_')[0];
      //   const layouts = newLayout.filter((layout) => {
      //     const layoutSubjCode = layout.i.split('_')[0];
      //     return layoutSubjCode == subjCode;
      //   });

      //   //check for adjacents
      //   const merged = layouts.reduce((accumulator, obj) => {

      //   })
      // }, []);
      setLayout(newLayout);
      console.log('layout changed');
    }
  }

  function onDropDragOver() {
    //set item dragging item maxH and minH
    const { totalRowSpanCount, itemCount } = scheduleLayout.reduce(
      (accumulator, currentItem) => {
        const subjCode = currentItem.i.split('_')[0];
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
    const unitsMaxSpan = draggingSubject.units * 2 + 1;
    const maxH = unitsMaxSpan - totalRowSpanCount + itemCount;

    return {
      w: 1,
      h: 2,
      minH: 2,
      maxH,
    };
  }

  function onDragStart(newLayout, layoutItem) {
    // console.log(layoutItem);
  }

  function onDragStop(newLayout, layoutItem) {}

  function onResizeEnd(newLayout, layoutItem) {}

  console.log(subjectScheds);

  return (
    <ResponsiveGridLayout
      className="grid-lines w-full border-r border-b border-gray-200"
      layout={layout.length ? layout : [...headers, ...timeLayout.flat()]}
      cols={headerColumns.length}
      rowHeight={36}
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
      // onDragStop={onDragStop}
      // onResizeStart={onResizeStart}
    >
      {headerColumns}
      {scheduleCells}
      {timeRows}
    </ResponsiveGridLayout>
  );
}
