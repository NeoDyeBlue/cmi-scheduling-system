import { useTable, useExpanded } from 'react-table';
import { useMemo, useCallback } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';
import usePaginate from '@/hooks/usePaginate';
import { toast } from 'react-hot-toast';
import {
  MdArrowDropDown,
  MdArrowRight,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import { courses } from '@/lib/test_data/scheduler';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CourseSchedulerYearSecTable from './CourseSchedulerYearSecTable';
import { SpinnerLoader } from '../Loaders';

export default function CourseTable({ type }) {
  const router = useRouter();
  const { docs, pageData, setPageIndex, isLoading } = usePaginate({
    url: '/api/courses/status',
    limit: 10,
    query: {
      type,
    },
  });

  const memoizedData = useMemo(() => docs, [docs]);

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
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: '1st sem',
        accessor: 'schedCompletionStatus.firstSem.isCompleted', // accessor is the "key" in the data
      },
      {
        Header: '2nd sem',
        accessor: 'schedCompletionStatus.secondSem.isCompleted', // accessor is the "key" in the data
      },
      {
        Header: 'Special',
        accessor: 'schedCompletionStatus.special.isCompleted', // accessor is the "key" in the data
      },
      {
        Header: 'Summer',
        accessor: 'schedCompletionStatus.summer.isCompleted', // accessor is the "key" in the data
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
  } = useTable({ columns, data: memoizedData }, useExpanded);

  return (
    <div className="flex flex-col gap-4">
      {isLoading && !docs?.length ? <SpinnerLoader size={36} /> : null}
      {!isLoading && !docs.length ? (
        <p className="mx-auto text-center text-ship-gray-500">
          Nothing to show
        </p>
      ) : null}
      {!isLoading && docs.length ? (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="w-full">
            <thead className="px-4 py-3 text-left font-display text-sm font-semibold">
              {headerGroups.map((headerGroup, index) => (
                <tr
                  key={index}
                  {...headerGroup.getHeaderGroupProps()}
                  className="border-b border-gray-300"
                >
                  {headerGroup.headers.map((column, columnIndex) => (
                    <th
                      key={columnIndex}
                      {...column.getHeaderProps()}
                      className={classNames(
                        'bg-ship-gray-50 px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg',
                        {
                          'text-center':
                            columnIndex == 3 ||
                            columnIndex == 4 ||
                            columnIndex == 5 ||
                            columnIndex == 6,
                        }
                      )}
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
                      //   onClick={() =>
                      //     router.push(
                      //       `/courses/${row.allCells[0].value.toLowerCase()}`
                      //     )
                      //   }
                      // {...row.getToggleRowExpandedProps({ title: '' })}
                      className={classNames(
                        'cursor-pointer border-y border-gray-200 transition-colors hover:bg-primary-50',
                        {
                          'border border-primary-200 bg-primary-50 hover:bg-primary-50':
                            row.isExpanded,
                        }
                      )}
                    >
                      {row.cells.map((cell, index) => {
                        if (
                          cell.column.Header == '1st sem' ||
                          cell.column.Header == '2nd sem' ||
                          cell.column.Header == 'Special' ||
                          cell.column.Header == 'Summer'
                        ) {
                          return (
                            <td
                              key={index}
                              className="text-center"
                              {...cell.getCellProps()}
                            >
                              <div className="flex items-center justify-center">
                                <div className="h-[24px] w-[24px] rounded-full bg-white">
                                  {cell.value == true ? (
                                    <MdCheckCircle
                                      size={24}
                                      className="text-success-400"
                                    />
                                  ) : (
                                    <MdCancel
                                      size={24}
                                      className="text-danger-400"
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className={classNames('p-4', {
                                'whitespace-nowrap font-semibold uppercase':
                                  index == 1,
                                'min-w-[300px]': index == 2,
                              })}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        }
                      })}
                    </tr>
                    {row.isExpanded ? (
                      <tr>
                        <td colSpan={visibleColumns.length}>
                          <div className="flex w-full flex-col border-x border-gray-200 p-4">
                            <Tabs className="flex flex-col">
                              <div className="flex flex-col gap-2">
                                <p className="w-fit whitespace-nowrap text-sm leading-none text-ship-gray-500">
                                  Select semester:
                                </p>
                                <TabList className="scrollbar-hide flex w-full gap-2 overflow-x-auto">
                                  <Tab
                                    selectedClassName="tab-active"
                                    className="tab-sm"
                                  >
                                    1st sem
                                  </Tab>
                                  <Tab
                                    selectedClassName="tab-active"
                                    className="tab-sm"
                                  >
                                    2nd sem
                                  </Tab>
                                  <Tab
                                    selectedClassName="tab-active"
                                    className="tab-sm"
                                  >
                                    Special
                                  </Tab>
                                  <Tab
                                    selectedClassName="tab-active"
                                    className="tab-sm"
                                  >
                                    Summer
                                  </Tab>
                                </TabList>
                              </div>

                              <TabPanel>
                                <CourseSchedulerYearSecTable
                                  courseCode={row.original.code}
                                  semester={'1'}
                                  data={
                                    row.original.schedCompletionStatus.firstSem
                                      .perYearSec || []
                                  }
                                />
                              </TabPanel>
                              <TabPanel>
                                <CourseSchedulerYearSecTable
                                  courseCode={row.original.code}
                                  semester={'2'}
                                  data={
                                    row.original.schedCompletionStatus.secondSem
                                      .perYearSec || []
                                  }
                                />
                              </TabPanel>
                              <TabPanel>
                                <CourseSchedulerYearSecTable
                                  courseCode={row.original.code}
                                  semester={'special'}
                                  data={
                                    row.original.schedCompletionStatus.special
                                      .perYearSec || []
                                  }
                                />
                              </TabPanel>
                              <TabPanel>
                                <CourseSchedulerYearSecTable
                                  courseCode={row.original.code}
                                  semester={'summer'}
                                  data={
                                    row.original.schedCompletionStatus.summer
                                      .perYearSec || []
                                  }
                                />
                              </TabPanel>
                            </Tabs>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={({ selected }) => setPageIndex(selected + 1)}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(pageData?.totalPages) || 0}
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
