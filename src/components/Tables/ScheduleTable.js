import { useTable } from 'react-table';
import { useMemo, forwardRef } from 'react';
import { parse, addMinutes, format } from 'date-fns';
import { ImageWithFallback } from '../Misc';
import classNames from 'classnames';

const ScheduleTable = forwardRef(function ScheduleTable(
  {
    id,
    data,
    startTime,
    endTime,
    interval,
    type,
    title = 'Schedules',
    subtitle = '',
  },
  ref
) {
  const weekDays = useMemo(
    () => [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    []
  );
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

  const groupedByDay = useMemo(() => {
    const newData = [];
    weekDays.forEach((day, dayIndex) => {
      const slots = [];
      data.forEach((schedule, schedIndex) => {
        schedule.dayTimes.forEach((dayTime) => {
          if (dayTime.day == dayIndex + 1) {
            dayTime.times.forEach((time) => {
              slots.push({
                teacher: schedule.teacher,
                subject: schedule.subject,
                course: schedule.course,
                room: dayTime.room,
                time: {
                  start: time.start,
                  end: time.end,
                },
              });
            });
          }
        });
      });

      newData.push({
        day,
        dayIndex: dayIndex + 1,
        slots,
      });
    });

    return newData;
  }, [data, weekDays]);

  console.log(groupedByDay);

  const columns = useMemo(
    () => [
      {
        Header: 'Time',
        id: 'time-left',
        // Cell: ({ row }) => timeData[row.index],
        accessor: 'time',
        fixed: 'left',
      },
      {
        Header: 'Monday',
        // id: "monday",
        dayIndex: 1,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'monday'),
      },
      {
        Header: 'Tuesday',
        // id: "tuesday",
        dayIndex: 2,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'tuesday'),
      },
      {
        Header: 'Wednesday',
        // id: "wednesday",
        dayIndex: 3,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'wednesday'),
      },
      {
        Header: 'Thursday',
        // id: "thursday",
        dayIndex: 4,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'thursday'),
      },
      {
        Header: 'Friday',
        // id: "friday",
        dayIndex: 5,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'friday'),
      },
      {
        Header: 'Saturday',
        // id: "saturday",
        dayIndex: 6,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'saturday'),
      },
      {
        Header: 'Sunday',
        // id: "sunday",
        dayIndex: 7,
        enableRowSpan: true,
        accessor: () => findSchedule(groupedByDay, 'sunday'),
      },
      {
        Header: 'Time',
        id: 'time-right',
        // Cell: ({ row }) => timeData[row.index],
        accessor: 'time',
        fixed: 'right',
      },
    ],
    [groupedByDay]
  );

  const newData = useMemo(
    () =>
      timeData.map((time) => ({
        time,
      })),
    [timeData]
  );

  function findSchedule(data, day) {
    const schedule = data.find((sched) => sched.day == day);
    return schedule ? schedule.slots : [];
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: newData });

  function createScheduleCell(slot, cell, cellIndex) {
    const timeStartIndex = timeData.findIndex(
      (timePairs) => timePairs[0] == slot.time.start
    );
    const timeEndIndex = timeData.findIndex(
      (timePairs) => timePairs[1] == slot.time.end
    );

    return (
      <td
        key={cellIndex}
        {...cell.getCellProps({
          rowSpan: timeEndIndex + 1 - timeStartIndex,
        })}
        className={classNames(
          'relative min-w-[150px] overflow-hidden border-2 border-indigo-300 bg-indigo-50 text-center text-sm'
          // 'z-10 before:absolute before:inset-0 before:h-full before:w-full before:bg-transparent'
          // `max-h-[${40 * Math.abs(timeEndIndex + 1 - timeStartIndex)}px]`
        )}
      >
        <div
          style={{
            maxHeight: `${40 * Math.abs(timeEndIndex + 1 - timeStartIndex)}px`,
          }}
          className={classNames(
            'relative flex flex-col items-center justify-center gap-1 overflow-hidden p-4 text-center'
            // `max-h-[${40 * Math.abs(timeEndIndex + 1 - timeStartIndex)}px]`
          )}
        >
          {type !== 'teachers' &&
          Math.abs(timeEndIndex + 1 - timeStartIndex) > 2 ? (
            <ImageWithFallback
              src={slot?.teacher?.image}
              alt="teacher image"
              width={42}
              height={42}
              fallbackSrc={'/images/teachers/default.jpg'}
              className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
            />
          ) : null}
          {type !== 'teachers' && type !== 'rooms' ? (
            <>
              <p
                className={classNames('font-medium', {
                  'font-display font-semibold': type !== 'courses',
                })}
              >
                {slot?.teacher?.firstName?.charAt(0)}. {slot?.teacher?.lastName}
              </p>
              <p className="font-medium">{slot?.room?.code}</p>
            </>
          ) : null}
          {type == 'teachers' && (
            <p className="font-medium uppercase">{slot?.room?.code}</p>
          )}
          {type == 'rooms' && (
            <p className="font-medium">
              {slot?.teacher?.firstName?.charAt(0)}. {slot?.teacher?.lastName}
            </p>
          )}
          <div>
            <p className="uppercase">{slot?.subject?.code}</p>
            <p className="text-xs">{slot?.subject?.name}</p>
          </div>
          {type !== 'courses' && (
            <p className="font-bold uppercase">
              {slot?.course?.code} {slot?.course?.year}
              {slot?.course?.section}
            </p>
          )}
        </div>
      </td>
    );
  }

  return (
    <>
      <div className="page-landscape flex flex-col gap-4 print:m-4" ref={ref}>
        <div className="hidden print:block">
          <p className="font-display text-2xl font-semibold">{title}</p>
          {subtitle && <p className="text-sm">{subtitle}</p>}
        </div>
        <table
          id={id}
          {...getTableProps()}
          className="w-full border border-gray-200 lg:table-fixed"
        >
          <thead className="p-4 text-center font-display text-xs font-semibold">
            {headerGroups.map((headerGroup, index) => (
              <tr
                key={index}
                {...headerGroup.getHeaderGroupProps()}
                className="border border-gray-300"
              >
                {headerGroup.headers.map((column, index) => (
                  <th
                    key={index}
                    {...column.getHeaderProps()}
                    className="border border-gray-200 px-4 py-3"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              if (rowIndex == 0) {
                row.rowSpans = [];
              } else {
                row.rowSpans =
                  rows[rowIndex - 1]?.rowSpans?.filter(
                    (r) => r.spanToRow >= rowIndex
                  ) || [];
              }
              for (let j = 0; j < row.allCells.length; j++) {
                let cell = row.allCells[j];

                if (cell.column?.enableRowSpan) {
                  let slot =
                    cell.value.length &&
                    cell.value.find(
                      (slot) => slot.time.start == timeData[rowIndex][0]
                    );

                  let rowSpanToIndex = 0;

                  if (slot) {
                    const timeEndIndex = timeData.findIndex(
                      (timePairs) => timePairs[1] == slot.time.end
                    );

                    rowSpanToIndex = timeEndIndex + 1;

                    row.rowSpans.push({
                      index: j,
                      spanToRow: rowSpanToIndex,
                    });
                  }
                }
              }
              return (
                <tr
                  key={rowIndex}
                  {...row.getRowProps()}
                  className="h-[40px] max-h-[40px] border border-gray-200"
                >
                  {row.cells.map((cell, cellIndex) => {
                    if (cellIndex == 0 || cellIndex == row.cells.length - 1) {
                      return (
                        <td
                          key={cellIndex}
                          {...cell.getCellProps()}
                          className={`h-[40px] max-h-[40px] border border-gray-200 text-center text-xs`}
                        >
                          <div
                            className={classNames(
                              'flex min-h-[40px] items-center justify-center gap-1 overflow-hidden px-4 text-center text-xs capitalize leading-none'
                            )}
                          >
                            <p>{cell.value[0]}</p> - <p>{cell.value[1]}</p>
                          </div>
                        </td>
                      );
                    } else {
                      const slot =
                        cell.value.length &&
                        cell.value.find(
                          (slot) => slot.time.start == timeData[rowIndex][0]
                        );
                      if (slot) {
                        return createScheduleCell(
                          slot,
                          cell,
                          cellIndex,
                          rowIndex
                        );
                      } else {
                        let span = row.rowSpans.find(
                          (r) => r.index == cellIndex
                        );
                        return span && span.spanToRow > rowIndex ? null : (
                          <td
                            key={cellIndex}
                            {...cell.getCellProps()}
                            className={`min-w-[150px] border border-gray-200 px-4 py-3 text-center text-xs`}
                          ></td>
                        );
                      }
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default ScheduleTable;
