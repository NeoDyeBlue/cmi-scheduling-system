import { useTable, useExpanded } from 'react-table';
import { useMemo } from 'react';
import TableActionButton from '../Buttons/TableActionButton';
import RoomTableSchedule from './RoomTableSchedule';
import {
  MdDelete,
  MdEdit,
  MdArrowDropDown,
  MdArrowRight,
  MdDownload,
} from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';

export default function RoomTable({ data }) {
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
        Header: 'Code',
        accessor: 'code', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name',
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
              icon={<MdEdit size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="edit"
              toolTipContent="Edit"
            />
            <TableActionButton
              icon={<MdDelete size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="delete"
              toolTipContent="Delete"
            />
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
    <table {...getTableProps()} className="w-full">
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
                className="bg-ship-gray-50 px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg "
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
                className={`cursor-pointer border-y border-gray-200 transition-colors hover:bg-primary-50
                ${
                  row.isExpanded
                    ? 'bg-primary-900 text-white hover:bg-primary-900'
                    : ''
                }`}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className={`p-4 ${
                        index == 1 ? 'font-semibold uppercase' : ''
                      }`}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    <div className="max-h-[400px] overflow-auto">
                      {/* <p className="font-display text-xl font-semibold">
                        Schedules
                      </p> */}
                      <RoomTableSchedule
                        data={row.original.schedules}
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
