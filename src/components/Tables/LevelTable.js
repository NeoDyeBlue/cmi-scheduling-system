import { useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';
import { ActionButton, CreateButton, Button } from '../Buttons';
import { MdDelete, MdEdit, MdTableView, MdRemove } from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import usePaginate from '@/hooks/usePaginate';
import { Modal, Confirmation } from '../Modals';
import { SheetForm, GradeLevelForm } from '../Forms';
import { PopupLoader } from '../Loaders';
import { toast } from 'react-hot-toast';
import { SpinnerLoader } from '../Loaders';

export default function LeveleTable({ type }) {
  const { theme } = resolveConfig(tailwindConfig);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [toEditLevel, setToEditLevel] = useState(null);
  const [toDeleteId, setToDeleteId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { docs, pageData, setPageIndex, mutate, isLoading } = usePaginate({
    url: `/api/grade-school${searchValue ? '/search' : ''}`,
    limit: 10,
    query: {
      type,
      ...(searchValue ? { q: searchValue } : {}),
    },
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Grade Level',
        accessor: 'level', // accessor is the "key" in the data
      },
      {
        Header: 'Sections',
        accessor: 'sections', // accessor is the "key" in the data
      },
      {
        Header: () => null,
        id: 'actions',
        Cell: ({ cell, row }) => (
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
                setToEditLevel(cell.row.original);
                setIsModalOpen(true);
              }}
            />
            {/* {console.log(row.index + 1, levelCount)}
            {row.index + 1 == levelCount && levelCount !== 0 ? (
              <ActionButton
                icon={<MdRemove size={16} className="text-white" />}
                buttonColor={theme.colors.primary[400]}
                toolTipId="remove"
                toolTipContent="Remove"
                onClick={() => {
                  setToDeleteId(cell.row.original._id);
                  setIsConfirmationOpen(true);
                }}
              />
            ) : null} */}
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
  } = useTable({ columns, data: _.sortBy(docs, ['level']) });

  async function deleteLevel() {
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
        label="Remove Last Level?"
        message="Removing the last level will affect the schedules."
        onCancel={() => {
          setIsConfirmationOpen(false);
        }}
        onConfirm={deleteLevel}
      />
      <Modal
        label="Import Levels"
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      >
        <SheetForm
          name="levels"
          seedFor={type}
          requiredColumns={[
            {
              columnName: 'level',
              description: 'the grade level',
            },
            ,
            {
              columnName: 'sections',
              description: 'the section count, minimun is 1',
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
        label={toEditLevel ? `Edit ${type} Level` : `New ${type} Level`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setToEditLevel(null);
        }}
      >
        <GradeLevelForm
          type={type}
          level={
            toEditLevel
              ? toEditLevel?.level
              : type == 'elementary'
              ? docs?.length + 1
              : 7 + (docs?.length % 7)
          }
          initialData={toEditLevel || null}
          onCancel={() => setIsModalOpen(false)}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            setToEditLevel(null);
            mutate();
          }}
        />
      </Modal>
      <div className="flex items-center justify-end gap-4">
        {/* <div className="w-full max-w-[350px]">
          <SearchForm
            placeholder={`Search ${type} levels`}
            onSearch={(value) => setSearchValue(value)}
          />
        </div> */}
        <div className="flex gap-2">
          {/* <CreateButton
            onClick={() => setIsImportOpen(true)}
            icon={<MdTableView size={24} />}
            text="Import Grade Levels"
            isForImporting
          /> */}
          <CreateButton
            onClick={() => setIsModalOpen(true)}
            text="Add a Level"
            disabled={
              type == 'elementary'
                ? docs?.length + 1 > 6
                : 7 + (docs?.length % 7) > 10
            }
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
      {pageData.totalDocs > 0 && (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              // setToDeleteId(cell.row.original._id);
              setIsConfirmationOpen(true);
            }}
          >
            Remove last level
          </Button>
        </div>
      )}

      {/* <ReactPaginate
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
      /> */}
    </div>
  );
}
