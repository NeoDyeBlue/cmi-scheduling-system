import { useTable } from 'react-table';
import { useMemo } from 'react';
import { ActionButton } from '../Buttons';
import { MdDelete, MdEdit } from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export default function CourseTable({ data }) {
  const { theme } = resolveConfig(tailwindConfig);
  const router = useRouter();
  const columns = useMemo(
    () => [
      //   {
      //     // Make an expander cell
      //     Header: () => null, // No header
      //     id: 'expander', // It needs an ID
      //     Cell: ({ row }) => (
      //       // Use Cell to render an expander for each row.
      //       // We can use the getToggleRowExpandedProps prop-getter
      //       // to build the expander.
      //       <span>
      //         {row.isExpanded ? (
      //           <MdArrowDropDown size={24} />
      //         ) : (
      //           <MdArrowRight size={24} />
      //         )}
      //       </span>
      //     ),
      //   },
      {
        Header: 'Code',
        accessor: 'code', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Years',
        accessor: 'years', // accessor is the "key" in the data
      },
      {
        Header: 'Sections',
        accessor: 'sections', // accessor is the "key" in the data
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
  } = useTable({ columns, data });

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
                onClick={() =>
                  router.push(`/courses/${row.allCells[0].value.toLowerCase()}`)
                }
                // {...row.getToggleRowExpandedProps({ title: '' })}
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
                        'whitespace-nowrap font-semibold uppercase': index == 0,
                        'min-w-[300px]': index == 1,
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {/* {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    <div className="overflow-auto">
                      <YearSectionTable data={row.original.yearSections} />
                    </div>
                  </td>
                </tr>
              ) : null} */}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}