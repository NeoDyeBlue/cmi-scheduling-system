import { useTable } from 'react-table';
import { useMemo, useState } from 'react';
import { ActionButton, CreateButton } from '../Buttons';
import { MdDelete, MdEdit, MdTableView } from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';
import usePaginate from '@/hooks/usePaginate';
import { Modal, Confirmation } from '../Modals';
import { CourseForm, SearchForm, SheetForm } from '../Forms';
import { PopupLoader } from '../Loaders';
import { toast } from 'react-hot-toast';
import { SpinnerLoader } from '../Loaders';

export default function CourseTable({ type }) {
  const { theme } = resolveConfig(tailwindConfig);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [toEditCourse, setToEditCourse] = useState(null);
  const [toDeleteId, setToDeleteId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { docs, pageData, setPageIndex, mutate, isLoading } = usePaginate({
    url: `/api/courses${searchValue ? '/search' : ''}`,
    limit: 10,
    query: {
      type,
      ...(searchValue ? { q: searchValue } : {}),
    },
  });

  const columns = useMemo(
    () => [
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
        Cell: ({ cell }) => (
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
                setToEditCourse(cell.row.original);
                setIsModalOpen(true);
              }}
            />
            <ActionButton
              icon={<MdDelete size={16} className="text-white" />}
              buttonColor={theme.colors.primary[400]}
              toolTipId="delete"
              toolTipContent="Delete"
              onClick={() => {
                setToDeleteId(cell.row.original._id);
                setIsConfirmationOpen(true);
              }}
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
  } = useTable({ columns, data: docs });

  async function deleteItem() {
    try {
      setIsDeleting(true);
      setIsConfirmationOpen(false);
      const res = await fetch(`/api/courses?id=${toDeleteId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result?.success) {
        toast.success('Course deleted');
        mutate();
      } else if (!result?.success) {
        toast.error('Delete failed');
      }
      setToDeleteId('');
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      setToDeleteId('');
      toast.error('Delete failed');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PopupLoader isOpen={isDeleting} message="Deleting course" />
      <Confirmation
        isOpen={isConfirmationOpen}
        label="Delete Course?"
        message="Deleting this course will affect the schedules."
        onCancel={() => {
          setIsConfirmationOpen(false);
        }}
        onConfirm={deleteItem}
      />
      <Modal
        label={`Import ${type == 'shs' ? 'tracks' : 'courses'}`}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      >
        <SheetForm
          name={type == 'shs' ? 'tracks' : 'courses'}
          seedFor={type}
          requiredColumns={[
            {
              columnName: 'code',
              description: `the ${
                type == 'shs' ? 'track' : 'course'
              } code e.g. ${type == 'shs' ? 'STEM' : 'BSCS'}`,
            },
            ,
            {
              columnName: 'name',
              description: `the ${type == 'shs' ? 'track' : 'course'} name`,
            },
            ,
            {
              columnName: 'years',
              description: `how many years are in the ${
                type == 'shs' ? 'track' : 'course'
              }`,
            },
          ]}
          onCancel={() => setIsImportOpen(false)}
          onAfterSubmit={() => {
            setIsImportOpen(false);
            mutate();
          }}
        />
      </Modal>
      <Modal
        label={
          toEditCourse
            ? type == 'shs'
              ? 'Edit track'
              : 'Edit course'
            : type == 'shs'
            ? 'New track'
            : 'New course'
        }
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setToEditCourse(null);
        }}
      >
        <CourseForm
          type={type}
          initialData={toEditCourse || null}
          onCancel={() => setIsModalOpen(false)}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            setToEditCourse(null);
            mutate();
          }}
        />
      </Modal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-[350px]">
          <SearchForm
            placeholder={`Search ${type} ${
              type == 'shs' ? 'tracks' : 'courses'
            }`}
            onSearch={(value) => setSearchValue(value)}
          />
        </div>
        <div className="flex gap-2">
          <CreateButton
            onClick={() => setIsImportOpen(true)}
            icon={<MdTableView size={24} />}
            text={`Import ${type == 'shs' ? 'tracks' : 'courses'}`}
            isForImporting
          />
          <CreateButton
            onClick={() => setIsModalOpen(true)}
            text={`New ${type == 'shs' ? 'track' : 'course'}`}
          />
        </div>
      </div>
      {isLoading && !docs?.length ? <SpinnerLoader size={36} /> : null}
      {!isLoading && !docs.length ? (
        <p className="mx-auto py-6 text-center text-ship-gray-500">
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
                  <React.Fragment key={row.original._id}>
                    <tr
                      // key={row.original._id}
                      {...row.getRowProps()}
                      onClick={() =>
                        router.push(
                          `/courses/${row.allCells[0].value.toLowerCase()}`
                        )
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
                        if (cell.column.Header == 'Sections' && type == 'shs') {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className="p-4"
                            >
                              <ul className="flex flex-wrap gap-2">
                                {cell.value.map((value, index) => (
                                  <li
                                    key={index}
                                    className="rounded-md bg-gray-200 px-2 py-1 capitalize"
                                  >
                                    {value}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className={classNames('p-4', {
                                'whitespace-nowrap font-semibold uppercase':
                                  index == 0,
                                'min-w-[300px]': index == 1,
                              })}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        }
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
