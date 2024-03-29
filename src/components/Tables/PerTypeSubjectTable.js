import { useState } from 'react';
import { CreateButton } from '../Buttons';
import React from 'react';
import classNames from 'classnames';
import { Modal } from '../Modals';
import { SubjectForm, SearchForm } from '../Forms';
import usePaginate from '@/hooks/usePaginate';
import { SpinnerLoader } from '../Loaders';
import ReactPaginate from 'react-paginate';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SubjectTable from './SubjectTable';

export default function PerTypeSubjectTable({ type }) {
  const tabs = ['1', '2'];
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <CreateButton onClick={() => setIsModalOpen(true)} text="New Subject" />
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
