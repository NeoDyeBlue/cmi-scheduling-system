import Head from 'next/head';
import { MainLayout } from '@/components/Layouts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import { CourseSchedulerTable } from '@/components/Tables';
import { SearchForm } from '@/components/Forms';

export default function Schedules() {
  const tabs = ['college', 'SHS'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <>
      <Head>
        <title>Scheduler | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        <Tabs
          className="flex flex-col"
          onSelect={(index) => setActiveTab(tabs[index])}
        >
          <div className="mb-4 flex items-center gap-4">
            <TabList className="scrollbar-hide flex w-fit gap-2 overflow-x-auto">
              <Tab selectedClassName="tab-active" className="tab">
                College
              </Tab>
              <Tab selectedClassName="tab-active" className="tab">
                Senior High
              </Tab>
            </TabList>
            <div className="ml-auto w-full max-w-[350px]">
              <SearchForm placeholder={`Search ${activeTab} courses`} />
            </div>
          </div>
          <TabPanel>
            <CourseSchedulerTable type="college" />
          </TabPanel>
          <TabPanel>
            <CourseSchedulerTable type="shs" />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

Schedules.getLayout = function getLayout(page) {
  return <MainLayout name="Scheduler">{page}</MainLayout>;
};
