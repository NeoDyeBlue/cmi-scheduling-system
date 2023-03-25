import Head from 'next/head';
import { MainLayout } from '@/components/Layouts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { SearchForm, CourseForm } from '@/components/Forms';
import { CreateButton } from '@/components/Buttons';
import { useState } from 'react';
import { collegeCourses } from '@/lib/test_data/courses';
import { Modal } from '@/components/Modals';
import { CourseTable } from '@/components/Tables';
// import usePaginate from '@/hooks/usePaginate';
// import ReactPaginate from 'react-paginate';

export default function Courses() {
  const tabs = ['college', 'SHS'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { docs, pageData, setPageIndex } = usePaginate({
  //   url: '/api/courses',
  //   limit: 10,
  //   query: {
  //     type: activeTab.toLowerCase(),
  //   },
  // });
  return (
    <>
      <Head>
        <title>Courses | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        <Modal
          label="New Course"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <CourseForm
            onCancel={() => setIsModalOpen(false)}
            onAfterSubmit={() => {
              setIsModalOpen(false);
            }}
          />
        </Modal>
        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-[350px]">
            <SearchForm placeholder={`Search ${activeTab} courses`} />
          </div>
          <CreateButton
            onClick={() => setIsModalOpen(true)}
            text="New Course"
          />
        </div>
        <Tabs
          className="flex flex-col gap-4"
          onSelect={(index) => setActiveTab(tabs[index])}
        >
          <TabList className="scrollbar-hide flex w-full gap-2 overflow-x-auto">
            <Tab selectedClassName="tab-active" className="tab">
              College
            </Tab>
            <Tab selectedClassName="tab-active" className="tab">
              Senior High
            </Tab>
          </TabList>

          <TabPanel>
            <CourseTable data={collegeCourses} type="college" />
          </TabPanel>
          <TabPanel>
            <CourseTable type="shs" />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

Courses.getLayout = function getLayout(page) {
  return <MainLayout name="Courses">{page}</MainLayout>;
};
