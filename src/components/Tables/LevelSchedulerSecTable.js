import { useTable } from 'react-table';
import { useMemo } from 'react';
import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export default function LevelSchedulerSecTable({
  data,
  section,
  scheduleType,
  level,
  type,
}) {
  const subjects = useMemo(() => data, [data]);
  const router = useRouter();
  const columns = useMemo(
    () => [
      {
        Header: 'Section',
        accessor: 'section',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns, data: subjects });

  return (
    <>
      <table
        {...getTableProps()}
        className="w-full border-separate border-spacing-y-2"
      >
        <thead className="px-4 py-3 text-left font-display text-sm font-semibold">
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={index}
              {...headerGroup.getHeaderGroupProps()}
              className="border-y border-gray-300"
            >
              {headerGroup.headers.map((column, index) => (
                <th
                  key={index}
                  {...column.getHeaderProps()}
                  className="px-4 py-2 text-center"
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
              <React.Fragment key={index}>
                <tr
                  key={index}
                  {...row.getRowProps()}
                  className={classNames(
                    'group cursor-pointer transition-colors hover:bg-gray-50'
                  )}
                  onClick={() =>
                    router.push(
                      `/scheduler/schedule/${level}?schedulerType=${scheduleType}&type=${type}&section=${section}`
                    )
                  }
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps()}
                        className="border-collapse border-y border-gray-200 p-4 text-center
                        first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r"
                      >
                        {cell.column.Header == 'Status' ? (
                          <div className="flex w-full justify-center">
                            <p
                              className={classNames(
                                'w-fit rounded-full px-2 py-[0.1rem] text-sm font-medium',
                                {
                                  'bg-success-100 text-success-600':
                                    cell.value == 'completed',
                                },
                                {
                                  'bg-warning-100 text-warning-600':
                                    cell.value == 'incomplete',
                                },
                                {
                                  'bg-danger-100 text-danger-600':
                                    cell.value == 'unscheduled',
                                }
                              )}
                            >
                              {cell.render('Cell')}
                            </p>
                          </div>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
