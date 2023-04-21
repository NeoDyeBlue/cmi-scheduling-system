import { useState } from 'react';
import { CreateButton } from '../Buttons';
import React from 'react';
import classNames from 'classnames';
import { Modal } from '../Modals';
import { SubjectForm, SearchForm, SheetForm } from '../Forms';
import usePaginate from '@/hooks/usePaginate';
import { SpinnerLoader } from '../Loaders';
import ReactPaginate from 'react-paginate';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SubjectTable from './SubjectTable';
import { MdTableView } from 'react-icons/md';

export default function PerTypeSubjectTable({ type }) {
  const tabs = ['1', '2'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0]);
  // const subjects = useMemo(() => data, [data]);

  const { docs, pageData, setPageIndex, mutate, isLoading } = usePaginate({
    url: `/api/subjects${searchValue ? '/search' : ''}`,
    limit: 10,
    query: {
      type,
      ...(searchValue ? { q: searchValue } : {}),
      semester: activeTab,
    },
  });
  return (
    <>
      <Modal
        label="Import Subjects"
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      >
        <SheetForm
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
              columnName: 'semester',
              description: 'what semester the subject will be taken ',
            },
            {
              columnName: 'type',
              description: "either'college' or 'shs'",
            },
            {
              columnName: 'units',
              description: 'the subject units',
            },
          ]}
          warningMessage="Successful import will remove all previously saved College and SHS subjects!"
          onCancel={() => setIsImportOpen(false)}
          onAfterSubmit={() => {
            setIsImportOpen(false);
            mutate();
          }}
        />
      </Modal>
      <Modal
        label={'New Subject'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <SubjectForm
          onCancel={() => {
            setIsModalOpen(false);
          }}
          onAfterSubmit={() => {
            setIsModalOpen(false);
            mutate();
          }}
        />
      </Modal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-[350px]">
          <SearchForm
            placeholder={`Search subjects`}
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
      <Tabs
        className="flex flex-col"
        onSelect={(index) => setActiveTab(tabs[index])}
      >
        <TabList className="scrollbar-hide mb-2 flex w-full gap-2 overflow-x-auto">
          <Tab selectedClassName="tab-active" className="tab-sm">
            1st sem
          </Tab>
          <Tab selectedClassName="tab-active" className="tab-sm">
            2nd sem
          </Tab>
        </TabList>

        <div>
          {isLoading && !docs?.length ? <SpinnerLoader size={36} /> : null}
          {!isLoading && !docs.length ? (
            <p className="mx-auto py-6 text-center text-ship-gray-500">
              Nothing to show
            </p>
          ) : null}
          <>
            <TabPanel>
              <div className="flex flex-col gap-4">
                {!isLoading && docs.length ? (
                  <SubjectTable data={docs} mutate={mutate} />
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
            </TabPanel>
            <TabPanel>
              <div className="flex flex-col gap-4">
                {!isLoading && docs.length ? (
                  <SubjectTable data={docs} mutate={mutate} />
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
            </TabPanel>
          </>
        </div>
        {/* <TabPanel>
            <CourseTable data={collegeCourses} type="college" />
          </TabPanel>
          <TabPanel>
            <CourseTable type="shs" />
          </TabPanel> */}
      </Tabs>
    </>
  );
}
