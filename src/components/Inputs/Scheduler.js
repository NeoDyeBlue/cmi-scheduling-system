import GridLayout, { WidthProvider } from 'react-grid-layout';
import { useMemo, useState, useEffect } from 'react';
import { parse, format, addMinutes } from 'date-fns';

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
      // { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
      // { i: 'c', x: 4, y: 0, w: 1, h: 2 },
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

  const scheduleCells = schedules.map((schedule) => (
    <div
      key={schedule.i}
      className="flex cursor-move items-center justify-center rounded-md bg-primary-300"
    >
      sched
    </div>
  ));

  useEffect(
    () =>
      setLayout((prev) => [
        ...headers,
        ...prev,
        { i: 'a', x: 1, y: 1, w: 1, h: 2, minW: 1, minH: 2, maxW: 1 },
        { i: 'b', x: 2, y: 1, w: 1, h: 2, minW: 1, minH: 2, maxW: 1 },
        ...schedules,
        ...timeLayout.flat(),
      ]),
    [headers, timeLayout, schedules]
  );

  const onDrop = (layout, layoutItem, _event) => {
    // console.log(layoutItem, layout);
    // alert(
    //   `Dropped element props:\n${JSON.stringify(
    //     layoutItem,
    //     ['x', 'y', 'w', 'h', 'minH', 'i'],
    //     2
    //   )}`
    // );
    setSchedules((prev) => [...prev, layoutItem]);
  };

  function handleLayoutChange(newLayout) {
    //   setLayout(newLayout);
  }

  function onDropDragOver(e) {
    const text = e.dataTransfer.getData('text/plain');
    console.log(text, e.dataTransfer);
  }

  console.log(layout);

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
      //   onLayoutChange={() => console.log('changed')}
      // width={1200}
      isBounded={true}
      margin={[0, 0]}
      preventCollision
      compactType={null}
      isDroppable
      droppingItem={{ i: '__dropping-elem__', w: 1, h: 2, minH: 2 }}
      onDropDragOver={onDropDragOver}
    >
      {headerColumns}
      {scheduleCells}
      {timeRows}
      <div
        key="a"
        className="flex cursor-move items-center justify-center rounded-md bg-primary-500 text-white"
      >
        a
      </div>
      <div
        key="b"
        className="flex cursor-move items-center justify-center rounded-md bg-green-500 text-white"
      >
        b
      </div>
    </ResponsiveGridLayout>
  );
}
