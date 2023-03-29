import Head from 'next/head';
import { MainLayout } from '@/components/Layouts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { bscs } from '@/lib/test_data/courses';
import { PerSemScheduleTable } from '@/components/Tables';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { addOrdinalSuffix } from '@/utils/number-utils';
import React from 'react';
import { useRef } from 'react';

export default function Course() {
  const { theme } = resolveConfig(tailwindConfig);
  const router = useRouter();
  const { course } = router.query;
  const toPrintRefs = useRef([]);
  const tabs = bscs.yearSections.map((yearSection) => (
    <Tab key={yearSection.year} selectedClassName="tab-active" className="tab">
      {addOrdinalSuffix(yearSection.year)}
    </Tab>
  ));
  const tabPanels = bscs.yearSections.map((yearSection, yrSecIndex) => (
    <TabPanel key={yrSecIndex}>
      <div className="flex flex-col gap-4">
        <h2 className="border-b border-gray-200 pb-4 font-display text-3xl font-semibold">
          {addOrdinalSuffix(yearSection.year)} year
        </h2>
        <div className="flex flex-col gap-4">
          {yearSection.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">
                  Section {section.section}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <PerSemScheduleTable type="course" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </TabPanel>
  ));
  return (
    <>
      <Head>
        <title>{bscs.code.toUpperCase()} | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        {/* breadcrumbs */}
        <div className="flex items-center gap-2 text-ship-gray-400">
          <Link
            className="hover:text-primary-900 hover:underline"
            href="/courses"
          >
            Courses
          </Link>
          <p>{'>'}</p>
          <p className="font-semibold uppercase text-ship-gray-900">{course}</p>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-4xl font-bold">{bscs.name}</h1>
          {/* <p>Class Schedules</p> */}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">Choose a year:</p>
          <Tabs
            className="flex flex-col"
            // onSelect={(index) => setActiveTab(tabs[index])}
          >
            <TabList className="scrollbar-hide mb-6 flex w-full gap-2 overflow-x-auto">
              {tabs}
            </TabList>
            {tabPanels}
          </Tabs>
        </div>
      </div>
    </>
  );
}

Course.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
