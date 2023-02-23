import { useTable } from "react-table";
import { useMemo } from "react";
import Image from "next/image";
import TimeProgress from "../Misc/TimeProgress";
import TeacherTypeBadge from "../Misc/TeacherTypeBadge";

export default function ScheduleTable({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: "Teacher",
        accessor: "teacher", // accessor is the "key" in the data
      },
      {
        Header: "Type",
        accessor: "teacher.type",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Room",
        accessor: "room",
      },
      {
        Header: "Time Progress",
        accessor: "time",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} className="w-full">
      <thead className="p-4 text-left font-display text-sm font-semibold">
        {headerGroups.map((headerGroup, index) => (
          <tr
            key={index}
            {...headerGroup.getHeaderGroupProps()}
            className="border-b border-gray-300"
          >
            {headerGroup.headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps()}
                className="px-4 py-3"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          console.log(row);
          return (
            <tr
              key={index}
              {...row.getRowProps()}
              className="border-b border-gray-200"
            >
              {row.cells.map((cell, index) => {
                if (index === 0) {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className="min-w-[200px] max-w-[250px] px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={cell.value.image}
                          alt="teacher image"
                          width={42}
                          height={42}
                          className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
                        />
                        <p className="font-bold">
                          {cell.value.firstName} {cell.value.lastName}
                        </p>
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    key={index}
                    {...cell.getCellProps()}
                    className="px-4 py-3"
                  >
                    {(cell.value == "part-time" ||
                      cell.value == "full-time") && (
                      <TeacherTypeBadge
                        isPartTime={cell.value == "part-time"}
                      />
                    )}
                    {cell.value.start && cell.value.end && (
                      <TimeProgress
                        start={cell.value.start}
                        end={cell.value.end}
                      />
                    )}
                    {!(
                      cell.value == "part-time" || cell.value == "full-time"
                    ) &&
                      !(cell.value.start && cell.value.end) &&
                      cell.value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
