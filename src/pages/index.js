import Head from "next/head";
import dynamic from "next/dynamic";
import ScheduleTable from "@/components/Tables/ScheduleTable";
import { useMemo } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
const ClockCard = dynamic(() => import("@/components/Cards/ClockCard"), {
  ssr: false,
});
import CountCard from "@/components/Cards/CountCard";
import {
  MdCircle,
  MdIncompleteCircle,
  MdGroups,
  MdAccessTimeFilled,
} from "react-icons/md";
import currentSchedules from "@/lib/test_data/current-schedules";

export default function Home() {
  const sampleData = useMemo(() => currentSchedules, []);
  return (
    <>
      <Head>
        <title>Dashboard | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold capitalize md:text-3xl">
            Dashboard
          </h1>
        </div>
        {/* Cards */}
        <div className="flex grid-cols-2 flex-col gap-4 md:grid">
          <div>
            <ClockCard />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CountCard
              label="Total Teachers"
              count={100}
              icon={<MdGroups size={16} />}
              // iconColor={theme.colors.primary[500]}
            />
            <CountCard
              label="Part-time Teachers"
              count={50}
              icon={<MdIncompleteCircle size={16} />}
              // iconColor={theme.colors.primary[500]}
            />
            <CountCard
              label="Full-time Teachers"
              count={50}
              icon={<MdCircle size={16} />}
              // iconColor={theme.colors.primary[500]}
            />
            <CountCard
              label="Unscheduled Teachers"
              count={0}
              icon={<MdAccessTimeFilled size={16} />}
              // iconColor={theme.colors.primary[500]}
            />
          </div>
        </div>
        {/* Table */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <p className="font-display text-lg font-semibold">
              Current Schedules
            </p>
            <p className="text-sm text-gray-500">
              See the teachers who currently has classes at this hour.
            </p>
          </div>
          <div className="overflow-x-auto">
            <ScheduleTable data={sampleData} />
          </div>
        </div>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
