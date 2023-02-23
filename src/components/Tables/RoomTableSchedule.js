import { useTable, useGroupBy } from "react-table";
import { useMemo, useRef } from "react";
import { parse, addMinutes, format } from "date-fns";
import Image from "next/image";

export default function RoomTableSchedule({
  data,
  startTime,
  endTime,
  interval,
}) {
  const timeData = useMemo(() => {
    const start = parse(startTime, "hh:mm a", new Date());
    const end = parse(endTime, "hh:mm a", new Date());

    let current = start;
    const times = [];

    while (current <= end) {
      times.push(format(current, "h:mm a"));
      current = addMinutes(current, interval);
    }

    return times;
  }, [startTime, endTime, interval]);

  const lastSpan = useRef({
    row: 0,
    column: 0,
  });

  const columns = useMemo(
    () => [
      {
        Header: "Time",
        id: "time-left",
        // Cell: ({ row }) => timeData[row.index],
        accessor: "time",
        fixed: "left",
      },
      {
        Header: "Days",
        fixed: "top",
        columns: [
          {
            Header: "Monday",
            // id: "monday",
            dayIndex: 1,
            accessor: () => findSchedule(data, "monday"),
          },
          {
            Header: "Tuesday",
            // id: "tuesday",
            dayIndex: 2,
            accessor: () => findSchedule(data, "tuesday"),
          },
          {
            Header: "Wednesday",
            // id: "wednesday",
            dayIndex: 3,
            accessor: () => findSchedule(data, "wednesday"),
          },
          {
            Header: "Thursday",
            // id: "thursday",
            dayIndex: 4,
            accessor: () => findSchedule(data, "thursday"),
          },
          {
            Header: "Friday",
            // id: "friday",
            dayIndex: 5,
            accessor: () => findSchedule(data, "friday"),
          },
          {
            Header: "Saturday",
            // id: "saturday",
            dayIndex: 6,
            accessor: () => findSchedule(data, "saturday"),
          },
          {
            Header: "Sunday",
            // id: "sunday",
            dayIndex: 7,
            accessor: () => findSchedule(data, "sunday"),
          },
        ],
      },
      {
        Header: "Time",
        id: "time-right",
        // Cell: ({ row }) => timeData[row.index],
        accessor: "time",
        fixed: "right",
      },
    ],
    []
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
    useTable({ columns, data: newData }, useGroupBy);

  function createScheduleCell(slot, cell, cellIndex) {
    const timeStartIndex = timeData.indexOf(slot.time.start);
    const timeEndIndex = timeData.indexOf(slot.time.end);

    console.log(cell.column.dayIndex, timeEndIndex + 1 - timeStartIndex);

    lastSpan.current.column = cell.column.dayIndex;
    lastSpan.current.row = timeEndIndex + 1 - timeStartIndex;

    console.log(lastSpan);

    return (
      <td
        key={cellIndex}
        {...cell.getCellProps({
          rowSpan: timeEndIndex + 1 - timeStartIndex,
        })}
        className="min-w-[150px] border border-success-200 bg-success-100 px-4 py-3 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <Image
            src={slot.teacher.image}
            alt="teacher image"
            width={42}
            height={42}
            className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
          />
          <p className="font-display font-semibold">{slot.subject.code}</p>
          <p className="font-medium">
            {slot.teacher.firstName.charAt(0)}. {slot.teacher.lastName}
          </p>
        </div>
      </td>
    );
  }

  return (
    <table
      {...getTableProps()}
      className="w-full table-fixed border border-gray-200"
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
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr
              key={rowIndex}
              {...row.getRowProps()}
              className="border border-gray-200"
            >
              {row.cells.map((cell, cellIndex) => {
                if (cellIndex == 0 || cellIndex == row.cells.length - 1) {
                  return (
                    <td
                      key={cellIndex}
                      {...cell.getCellProps()}
                      className={`border border-gray-200 px-4 py-3 text-center text-xs`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                } else {
                  const slot =
                    cell.value.length &&
                    cell.value.find(
                      (slot) => slot.time.start == timeData[rowIndex]
                    );
                  if (slot) {
                    return createScheduleCell(slot, cell, cellIndex, rowIndex);
                  } else {
                    return (
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
  );
}
