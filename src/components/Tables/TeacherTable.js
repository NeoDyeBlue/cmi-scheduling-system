import { useTable, useExpanded } from 'react-table';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ActionButton } from '../Buttons';
import ScheduleTable from './ScheduleTable';
import { TeacherTypeBadge } from '../Misc';
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
import classNames from 'classnames';
import { useSWR } from 'swr';
import ReactPaginate from 'react-paginate';

export default function TeacherTable() {
  const { theme } = resolveConfig(tailwindConfig);

  const [activePageIndex, setActivePageIndex] = useState(1);

  const {
    data: teachers,
    error,
    mutate,
  } = useSWR(`/api/teachers?page=${activePageIndex}&limit=10`);

  const data = useMemo(() => teachers?.data?.docs || [], [teachers]);

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
        Header: 'ID',
        accessor: 'teacherId', // accessor is the "key" in the data
      },
      {
        Header: 'Image',
        accessor: 'image', // accessor is the "key" in the data
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Days',
        accessor: 'preferredDays',
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: () => (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-end gap-2"
          >
            <ActionButton
              icon={<MdEdit size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="edit"
              toolTipContent="Edit"
            />
            <ActionButton
              icon={<MdDelete size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="delete"
              toolTipContent="Delete"
            />
            <ActionButton
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

  function createDays(days) {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let dayBadges;
    if (days && days.length) {
      dayBadges = days.map((day, index) => (
        <span
          key={index}
          className="rounded-full border border-info-600 bg-info-100 px-2 py-[0.1rem] text-xs font-medium text-info-600"
        >
          {daysOfWeek[Number(day)]}
        </span>
      ));
    }

    return (
      <div className="flex min-w-[300px] flex-wrap gap-2">
        {days.length ? (
          dayBadges
        ) : (
          <span className="rounded-full border border-info-600 bg-info-100 px-2 py-[0.1rem] text-xs font-medium text-info-600">
            Monday - Satuday
          </span>
        )}
      </div>
    );
  }

  function handlePageClick({ selected }) {
    setActivePageIndex(selected + 1);
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns, data }, useExpanded);

  return (
    <div className="flex flex-col gap-4">
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
                  className={classNames(
                    'cursor-pointer border-y border-gray-200 transition-colors hover:bg-primary-50',
                    {
                      'bg-primary-900 text-white hover:bg-primary-900':
                        row.isExpanded,
                    }
                  )}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps()}
                        className={classNames('p-4', {
                          'whitespace-nowrap font-semibold uppercase':
                            index == 1,
                          'min-w-[150px]': index == 3 || index == 4,
                        })}
                      >
                        {cell.column.Header == 'Image' && (
                          <Image
                            src={cell.value}
                            alt="teacher image"
                            width={42}
                            height={42}
                            className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
                          />
                        )}
                        {cell.column.Header == 'Days' && createDays(cell.value)}
                        {cell.column.Header == 'Type' && (
                          <TeacherTypeBadge
                            isPartTime={cell.value == 'part-time'}
                          />
                        )}
                        {cell.column.Header != 'Image' &&
                        cell.column.Header != 'Days' &&
                        cell.column.Header != 'Type'
                          ? cell.render('Cell')
                          : null}
                        {/* {cell.value == 'part-time' ||
                      cell.value == 'full-time' ? (
                        <TeacherTypeBadge
                          isPartTime={cell.value == 'part-time'}
                        />
                      ) : (
                        cell.render('Cell')
                      )} */}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      <div className="overflow-auto">
                        <ScheduleTable
                          data={row.original.schedules}
                          startTime="7:00 AM"
                          endTime="6:00 PM"
                          interval={30}
                          type="teacher"
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
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(teachers?.data?.totalPages) || 0}
        previousLabel="< prev"
        renderOnZeroPageCount={null}
        containerClassName="paginate-container"
        previousLinkClassName="paginate-button"
        nextLinkClassName="paginate-button"
        pageLinkClassName="paginate-link"
        activeLinkClassName="paginate-link-active"
        breakLinkClassName="paginate-break"
        disabledLinkClassName="paginate-link-disabled"
      />
    </div>
  );
}
