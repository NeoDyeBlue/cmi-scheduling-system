import { useTable } from 'react-table';
import { useMemo, useState } from 'react';
import { ActionButton } from '../Buttons';
import { MdDelete, MdEdit, MdDownload } from 'react-icons/md';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import React from 'react';
import classNames from 'classnames';
import { Modal } from '../Modals';
import { SubjectForm } from '../Forms';

export default function SubjectTable({ data, onAfterEditSubmit = () => {} }) {
  const { theme } = resolveConfig(tailwindConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toEditData, setToEditData] = useState(null);
  const subjects = useMemo(() => data, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'Code',
        accessor: 'code', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Units',
        accessor: 'units',
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
                setToEditData(cell.row.original);
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
  } = useTable({ columns, data: subjects });

  return (
    <>
      <Modal
        label="Edit Subject"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <SubjectForm
          initialData={toEditData}
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
                  className={classNames(
                    'border-y border-gray-200 transition-colors'
                  )}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps()}
                        className={classNames('p-4', {
                          'font-semibold uppercase': index == 1,
                        })}
                      >
                        {cell.render('Cell')}
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
