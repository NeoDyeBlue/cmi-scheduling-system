import { useTable, useExpanded } from 'react-table';
import { useMemo } from 'react';
import TableActionButton from '../Buttons/TableActionButton';
import ScheduleTable from './ScheduleTable';
import { MdArrowDropDown, MdArrowRight, MdDownload } from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';

export default function YearSectionTable({ data }) {
  const { theme } = resolveConfig(tailwindConfig);
  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span>
            {row.isExpanded ? (
              <MdArrowDropDown size={24} />
            ) : (
              <MdArrowRight size={24} />
            )}
          </span>
        ),
      },
      {
        Header: 'Year',
        accessor: 'year', // accessor is the "key" in the data
      },
      {
        Header: 'Section',
        accessor: 'section',
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: () => (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-end gap-2"
          >
            <TableActionButton
              icon={<MdDownload size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="export"
              toolTipContent="Export"
            />
          </div>
        ),
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
  } = useTable({ columns, data }, useExpanded);

  return (
    <table {...getTableProps()} className="w-full border border-gray-200">
      <thead className="px-4 py-3 text-left font-display text-sm font-semibold">
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
            <React.Fragment key={index}>
              <tr
                key={index}
                {...row.getRowProps()}
                {...row.getToggleRowExpandedProps({ title: '' })}
                className={classNames(
                  'cursor-pointer border-y border-gray-200 transition-colors',
                  {
                    'bg-primary-100 hover:bg-primary-100': row.isExpanded,
                    'hover:bg-primary-50': !row.isExpanded,
                  }
                )}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className={classNames('p-4', {
                        'w-[50px]':
                          index == 0 || index == row.allCells.length - 1,
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    <div className="max-h-[500px] overflow-auto">
                      <ScheduleTable
                        data={row.original.schedules || []}
                        startTime="7:00 AM"
                        endTime="6:00 PM"
                        interval={30}
                      />
                    </div>
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
