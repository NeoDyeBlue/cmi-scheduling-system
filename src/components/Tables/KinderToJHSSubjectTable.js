import { useState } from 'react';
import { CreateButton } from '../Buttons';
import React from 'react';
import classNames from 'classnames';
import { Modal } from '../Modals';
import {
  SubjectForm,
  KinderToJHSSubjectForm,
  SearchForm,
  SheetForm,
} from '../Forms';
import usePaginate from '@/hooks/usePaginate';
import { SpinnerLoader } from '../Loaders';
import ReactPaginate from 'react-paginate';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SubjectTable from './SubjectTable';
import { MdTableView } from 'react-icons/md';

export default function KinderToJHSSubjectTable({ type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  // const subjects = useMemo(() => data, [data]);

  const { docs, pageData, setPageIndex, mutate, isLoading } = usePaginate({
    url: `/api/subjects${searchValue ? '/search' : ''}`,
    limit: 10,
    query: {
      type,
      ...(searchValue ? { q: searchValue } : {}),
    },
  });
  return (
    <>
      <Modal
        label={`Import ${type} Subjects`}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      >
        <SheetForm
          type={type}
          name="subjects"
          seedFor="subjects"
          requiredColumns={[
            {
              columnName: 'code',
              description: 'the subject code e.g. APPSDEV',
            },
            {
              columnName: 'name',
              description: 'the subject name',
            },
            {
              columnName: 'minutes',
              description:
                'the subject total minutes should be divisible by 10',
            },
          ]}
          warningMessage={`Successful import will remove all previously saved ${type} subjects!`}
          onCancel={() => setIsImportOpen(false)}
          onAfterSubmit={() => {
            setIsImportOpen(false);
            mutate();
          }}
        />
      </Modal>
      <Modal
        label={`New ${type} Subject`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <KinderToJHSSubjectForm
          onCancel={() => {
            setIsModalOpen(false);
          }}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            mutate();
          }}
          type={type}
        />
      </Modal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-[350px]">
          <SearchForm
            placeholder={`Search ${type} subjects`}
            onSearch={(value) => setSearchValue(value)}
          />
        </div>
        <div className="flex gap-2">
          <CreateButton
            onClick={() => setIsImportOpen(true)}
            icon={<MdTableView size={24} />}
            text="Import Subjects"
            isForImporting
          />
          <CreateButton
            onClick={() => setIsModalOpen(true)}
            text="New Subject"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          {isLoading && !docs?.length ? <SpinnerLoader size={36} /> : null}
          {!isLoading && !docs.length ? (
            <p className="mx-auto py-6 text-center text-ship-gray-500">
              Nothing to show
            </p>
          ) : null}
          <div className="flex flex-col gap-4">
            {!isLoading && docs.length ? (
              <SubjectTable data={docs} mutate={mutate} type={type} />
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
        </div>
      </div>
    </>
  );
}
