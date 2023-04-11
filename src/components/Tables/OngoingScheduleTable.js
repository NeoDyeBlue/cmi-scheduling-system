import { useTable } from 'react-table';
import { useMemo } from 'react';
import TimeProgress from '../Misc/TimeProgress';
import TeacherTypeBadge from '../Misc/TeacherTypeBadge';
import { ImageWithFallback } from '../Misc';
import classNames from 'classnames';

export default function OngoingScheduleTable({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Teacher',
        accessor: 'teacher', // accessor is the "key" in the data
      },
      {
        Header: 'Type',
        accessor: 'teacher.type',
      },
      {
        Header: 'Subject',
        accessor: 'schedule.subject.code',
      },
      {
        Header: 'Room',
        accessor: 'schedule.room.code',
      },
      {
        Header: 'Time Progress',
        accessor: 'schedule.time',
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
                {column.render('Header')}
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
                        <ImageWithFallback
                          src={cell.value.image}
                          alt="teacher image"
                          width={42}
                          height={42}
                          fallbackSrc="/images/default-teacher.jpg"
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
                    className={classNames('px-4 py-3', {
                      uppercase:
                        cell.column.Header == 'Subject' ||
                        cell.column.Header == 'Room',
                    })}
                  >
                    {cell.column.Header == 'Type' && (
                      <TeacherTypeBadge isPartTime={!cell.value} />
                    )}
                    {cell?.value?.start && cell?.value?.end && (
                      <TimeProgress
                        start={cell.value.start}
                        end={cell.value.end}
                      />
                    )}
                    {cell.column.Header !== 'Type' &&
                    !(cell?.value?.start && cell?.value?.end)
                      ? cell.value
                      : null}
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
