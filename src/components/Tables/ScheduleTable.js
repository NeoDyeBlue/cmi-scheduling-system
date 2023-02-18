import { useTable } from "react-table";
import { useMemo } from "react";
import Image from "next/image";
import { MdCircle, MdIncompleteCircle } from "react-icons/md";

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
        Header: "Time-start",
        accessor: "timeStart",
      },
      {
        Header: "Time-end",
        accessor: "timeEnd",
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
            className="border-b border-gray-200"
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
                      {/* <img
                        src={cell.row.original.image}
                        alt={cell.row.original.alt}
                        width="50"
                        height="50"
                      /> */}
                      {/* {cell.render("Cell")} */}
                    </td>
                  );
                }
                return (
                  <td
                    key={index}
                    {...cell.getCellProps()}
                    className="px-4 py-3"
                  >
                    {cell.value == "part-time" || cell.value == "full-time" ? (
                      <p
                        className={`flex w-fit items-center gap-1 whitespace-nowrap rounded-full border-0 px-2 py-[0.1rem] 
                        text-xs font-medium 
                        ${
                          cell.value == "part-time"
                            ? "border-warning-600 bg-warning-100 text-warning-600"
                            : "border-success-600 bg-success-100 text-success-600"
                        }`}
                      >
                        {cell.value == "part-time" ? (
                          <MdIncompleteCircle size={12} />
                        ) : (
                          <MdCircle size={12} />
                        )}
                        {cell.value}
                      </p>
                    ) : (
                      cell.render("Cell")
                    )}
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
