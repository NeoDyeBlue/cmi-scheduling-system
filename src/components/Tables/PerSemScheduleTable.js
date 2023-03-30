import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ScheduleTable from './ScheduleTable';
import { useState } from 'react';
import ReactToPrint from 'react-to-print';
import { MdDownload } from 'react-icons/md';
import { ActionButton } from '../Buttons';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config';
import { useRef } from 'react';
import useSWR from 'swr';

export default function PerSemScheduleTable({ type = '', fetchQuery }) {
  const { theme } = resolveConfig(tailwindConfig);
  const tabs = ['1', '2', 'special', 'summer'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const firstSemTableRef = useRef();
  const secondSemTableRef = useRef();
  const specialSemTableRef = useRef();
  const summerSemTableRef = useRef();

  //fetch func here for getting all the persem schedules
  const { data, error, isLoading } = useSWR(
    `/api/${type}/schedules?${new URLSearchParams({
      ...fetchQuery,
    }).toString()}`
  );

  console.log(data);

  return (
    <Tabs
      className="flex flex-col"
      onSelect={(index) => setActiveTab(tabs[index])}
    >
      <div className="flex items-center justify-between gap-4 bg-gray-50 py-2 px-4">
        <TabList className="scrollbar-hide flex w-full gap-2 overflow-x-auto">
          <Tab selectedClassName="tab-active" className="tab-sm">
            1st sem
          </Tab>
          <Tab selectedClassName="tab-active" className="tab-sm">
            2nd sem
          </Tab>
          <Tab selectedClassName="tab-active" className="tab-sm">
            Special
          </Tab>
          <Tab selectedClassName="tab-active" className="tab-sm">
            Summer
          </Tab>
        </TabList>
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
              return specialSemTableRef?.current;
            } else if (activeTab == tabs[3]) {
              return summerSemTableRef?.current;
            }
          }}
        />
      </div>
      <TabPanel>
        <div className="overflow-x-auto">
          <ScheduleTable
            ref={firstSemTableRef}
            data={[]}
            startTime="7:00 AM"
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
            data={[]}
            startTime="7:00 AM"
            endTime="6:00 PM"
            interval={30}
            type={type}
          />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="overflow-x-auto">
          <ScheduleTable
            ref={specialSemTableRef}
            data={[]}
            startTime="7:00 AM"
            endTime="6:00 PM"
            interval={30}
            type={type}
          />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="overflow-x-auto">
          <ScheduleTable
            ref={summerSemTableRef}
            data={[]}
            startTime="7:00 AM"
            endTime="6:00 PM"
            interval={30}
            type={type}
          />
        </div>
      </TabPanel>
    </Tabs>
  );
}
