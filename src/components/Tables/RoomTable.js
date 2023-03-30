import { useTable, useExpanded } from 'react-table';
import { useMemo, useState, useRef } from 'react';
import { ActionButton } from '../Buttons';
import ScheduleTable from './ScheduleTable';
import PerSemScheduleTable from './PerSemScheduleTable';
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
import { Modal, Confirmation } from '../Modals';
import { RoomForm } from '../Forms';
import { PopupLoader } from '../Loaders';
import { toast } from 'react-hot-toast';
export default function RoomTable({ data, mutate = () => {} }) {
  const { theme } = resolveConfig(tailwindConfig);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [toEditData, setToEditData] = useState(null);
  const [toDeleteId, setToDeleteId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const rooms = useMemo(() => data, [data]);
  const toPrintRefs = useRef([]);

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
                setToEditData(cell.row.original);
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
            {/* <ReactToPrint
              trigger={() => (
                <ActionButton
                  icon={<MdDownload size={16} className="text-white" />}
                  buttonColor={theme.colors.primary[400]}
                  toolTipId="export"
                  toolTipContent="Export"
                />
              )}
              content={() => toPrintRefs.current[row.index]}
            /> */}
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
  } = useTable({ columns, data: rooms }, useExpanded);

  async function deleteItem() {
    try {
      setIsDeleting(true);
      setIsConfirmationOpen(false);
      const res = await fetch(`/api/rooms?id=${toDeleteId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result?.success) {
        toast.success('Room deleted');
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
    <>
      <PopupLoader isOpen={isDeleting} message="Deleting room" />
      <Confirmation
        isOpen={isConfirmationOpen}
        label="Delete Room?"
        message="All schedules in this room will also be removed."
        onCancel={() => {
          setIsConfirmationOpen(false);
        }}
        onConfirm={deleteItem}
      />
      <Modal
        label="Edit Room"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <RoomForm
          initialData={toEditData}
          onCancel={() => setIsModalOpen(false)}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            mutate();
          }}
        />
      </Modal>
      <div className="flex flex-col gap-2">
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
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <React.Fragment key={rowIndex}>
                  <tr
                    key={rowIndex}
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
                            'font-semibold uppercase': index == 1,
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
                        <div className="overflow-auto">
                          <PerSemScheduleTable
                            type="rooms"
                            fetchQuery={{ code: row.original.code }}
                          />
                          {/* <ScheduleTable
                            ref={(el) => (toPrintRefs.current[rowIndex] = el)}
                            id={row.original.code}
                            data={row.original.schedules}
                            startTime="7:00 AM"
                            endTime="6:00 PM"
                            interval={30}
                            type="room"
                          /> */}
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
    </>
  );
}
