import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { parse, format, addMinutes } from 'date-fns';
import useSchedulerStore from '@/stores/useSchedulerStore';
import classNames from 'classnames';

/**
 * fix layout change handler
 * restrict dragging based on sched
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
  const [schedules, setSchedules] = useState([]);

  //stores
  const { draggingSchedule } = useSchedulerStore();

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

  const scheduleCells = schedules.map((schedule) => {
    // <SchedulerSchedItem key={schedule.i} data={schedule.data} />
    const data = schedule.data;
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

  useEffect(() => {
    console.log('r');
    setLayout(() => [...headers, ...schedules, ...timeLayout.flat()]);
  }, [headers, schedules, timeLayout]);

  const onDrop = (layout, layoutItem, _event) => {
    const data = JSON.parse(_event.dataTransfer.getData('text/plain'));
    setSchedules((prev) => [...prev, { ...layoutItem, i: data.code, data }]);
  };

  function handleLayoutChange(newLayout) {
    setLayout(newLayout);
    console.log('changed');
  }

  function onDropDragOver() {
    return {
      w: 1,
      h: 2,
      minH: 2,
      maxH: draggingSchedule.units * 2 + 1,
    };
  }

  // console.log(layout);

  return (
    <ResponsiveGridLayout
      className="grid-lines w-full border-r border-b border-gray-200"
      layout={layout}
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
    >
      {headerColumns}
      {scheduleCells}
      {timeRows}
    </ResponsiveGridLayout>
  );
}
