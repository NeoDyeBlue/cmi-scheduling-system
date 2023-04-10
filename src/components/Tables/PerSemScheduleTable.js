import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ScheduleTable from './ScheduleTable';
import { useMemo, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { MdDownload, MdEdit } from 'react-icons/md';
import { ActionButton } from '../Buttons';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { useRef } from 'react';
import useSWR from 'swr';
import { SpinnerLoader } from '../Loaders';
import { useRouter } from 'next/router';

export default function PerSemScheduleTable({
  type = '',
  fetchQuery,
  title = '',
  courseData,
  editable = false,
}) {
  const router = useRouter();
  const { theme } = resolveConfig(tailwindConfig);
  const tabs = ['1', '2', 'special', 'summer'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const firstSemTableRef = useRef();
  const secondSemTableRef = useRef();
  const specialSemTableRef = useRef();
  const summerSemTableRef = useRef();

  //fetch func here for getting all the perSemSchedules
  const {
    data: result,
    error,
    isLoading,
  } = useSWR(
    `/api/schedules?${new URLSearchParams({
      by: type,
      ...fetchQuery,
    }).toString()}`
  );

  const perSemSchedules = useMemo(() => result?.data, [result]);

  return (
    <Tabs
      className="flex flex-col"
      onSelect={(index) => setActiveTab(tabs[index])}
    >
      {isLoading && !perSemSchedules ? <SpinnerLoader size={24} /> : null}
      {!isLoading && !perSemSchedules ? (
        <p className="mx-auto py-6 text-center text-ship-gray-500">
          Nothing to show
        </p>
      ) : null}
      {!isLoading && perSemSchedules ? (
        <>
          <div className="flex items-center justify-between gap-4 bg-gray-50 py-2 px-4">
            <TabList className="scrollbar-hide flex w-full gap-2 overflow-x-auto">
              <Tab selectedClassName="tab-active" className="tab-sm">
                1st sem
              </Tab>
              <Tab selectedClassName="tab-active" className="tab-sm">
                2nd sem
              </Tab>
              {/* <Tab selectedClassName="tab-active" className="tab-sm">
                Special
              </Tab> */}
              <Tab selectedClassName="tab-active" className="tab-sm">
                Summer
              </Tab>
            </TabList>
            <div className="item-center flex gap-2">
              {editable && (
                <ActionButton
                  icon={<MdEdit size={16} className="text-white" />}
                  buttonColor={theme.colors.primary[400]}
                  toolTipId="edit"
                  toolTipContent="Edit"
                  onClick={() =>
                    router.push(
                      `/scheduler/schedule/${courseData?.code}?semester=${activeTab}&year=${courseData?.year}&section=${courseData.section}`
                    )
                  }
                />
              )}
              <ReactToPrint
                trigger={() => (
                  <ActionButton
                    icon={<MdDownload size={16} className="text-white" />}
                    buttonColor={theme.colors.primary[400]}
                    toolTipId="export"
                    toolTipContent="Export"
                  />
                )}
                content={() => {
                  if (activeTab == tabs[0]) {
                    return firstSemTableRef?.current;
                  } else if (activeTab == tabs[1]) {
                    return secondSemTableRef?.current;
                  } else if (activeTab == tabs[2]) {
                    return summerSemTableRef?.current;
                  }
                }}
              />
            </div>
          </div>
          <TabPanel>
            <div className="overflow-x-auto">
              <ScheduleTable
                ref={firstSemTableRef}
                data={
                  perSemSchedules?.find((schedule) => schedule.semester == '1')
                    ?.schedules || []
                }
                title={title}
                subtitle="1st Semester Schedules"
                startTime="6:00 AM"
                endTime="6:00 PM"
                interval={30}
                type={type}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="overflow-x-auto">
              <ScheduleTable
                ref={secondSemTableRef}
                data={
                  perSemSchedules?.find((schedule) => schedule.semester == '2')
                    ?.schedules || []
                }
                title={title}
                subtitle="2nd Semester Schedules"
                startTime="6:00 AM"
                endTime="6:00 PM"
                interval={30}
                type={type}
              />
            </div>
          </TabPanel>
          {/* <TabPanel>
            <div className="overflow-x-auto">
              <ScheduleTable
                ref={specialSemTableRef}
                data={
                  perSemSchedules?.find(
                    (schedule) => schedule.semester == 'special'
                  )?.schedules || []
                }
                title={title}
                subtitle="Specials Schedules"
                startTime="6:00 AM"
                endTime="6:00 PM"
                interval={30}
                type={type}
              />
            </div>
          </TabPanel> */}
          <TabPanel>
            <div className="overflow-x-auto">
              <ScheduleTable
                ref={summerSemTableRef}
                data={
                  perSemSchedules?.find(
                    (schedule) => schedule.semester == 'summer'
                  )?.schedules || []
                }
                title={title}
                subtitle="Summer Schedules"
                startTime="6:00 AM"
                endTime="6:00 PM"
                interval={30}
                type={type}
              />
            </div>
          </TabPanel>
        </>
      ) : null}
    </Tabs>
  );
}
