import { useTable, useExpanded } from 'react-table';
import { useMemo, useState } from 'react';
// import Image from 'next/image';
import { ImageWithFallback } from '../Misc';
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
import { TeacherForm } from '../Forms';
import { Modal } from '../Modals';

export default function TeacherTable({ data, onAfterEditSubmit = () => {} }) {
  const { theme } = resolveConfig(tailwindConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEditTeacherData, setToEditTeacherData] = useState(null);
  const teachers = useMemo(() => data, [data]);

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
        Cell: ({ cell }) => {
          const data = cell.row.original;
          return (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end gap-2"
            >
              <ActionButton
                icon={<MdEdit size={16} className="text-white" />}
                buttonColor={theme.colors.primary[400]}
                toolTipId="edit"
                toolTipContent="Edit"
                onClick={() => {
                  setToEditTeacherData(data);
                  setIsModalOpen(true);
                }}
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
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function createDays(preferredDayTimes) {
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
    if (preferredDayTimes && preferredDayTimes.length) {
      dayBadges = preferredDayTimes.map((dayTime, index) => (
        <span
          key={index}
          className="rounded-full border border-info-600 bg-info-100 px-2 py-[0.1rem] text-xs font-medium text-info-600"
        >
          {daysOfWeek[dayTime.day - 1]}
        </span>
      ));
    }

    return (
      <div className="flex min-w-[300px] flex-wrap gap-2">
        {preferredDayTimes.length ? (
          dayBadges
        ) : (
          <span className="rounded-full border border-info-600 bg-info-100 px-2 py-[0.1rem] text-xs font-medium text-info-600">
            Monday - Satuday
          </span>
        )}
      </div>
    );
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns, data: teachers }, useExpanded);

  return (
    <>
      <Modal
        label="Edit Teacher"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <TeacherForm
          initialData={toEditTeacherData}
          onCancel={() => setIsModalOpen(false)}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            onAfterEditSubmit();
          }}
        />
      </Modal>
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
                          // <Image
                          //   src={cell.value}
                          //   alt="teacher image"
                          //   width={42}
                          //   height={42}
                          //   className="aspect-square flex-shrink-0 overflow-hidden rounded-full object-cover"
                          // />
                          <ImageWithFallback
                            src={cell.value}
                            alt="teacher image"
                            width={42}
                            height={42}
                            fallbackSrc="/images/teachers/default.jpg"
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
    </>
  );
}
