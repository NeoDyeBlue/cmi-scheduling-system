import Head from "next/head";
import dynamic from "next/dynamic";
import ScheduleTable from "@/components/Tables/ScheduleTable";
import { useMemo } from "react";
import MainLayout from "@/components/Layouts/MainLayout";
const ClockCard = dynamic(() => import("@/components/Misc/ClockCard"), {
  ssr: false,
});

export default function Home() {
  const sampleData = useMemo(
    () => [
      {
        teacher: {
          firstName: "John",
          lastName: "Doe",
          type: "part-time",
          image:
            "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
        },
        subject: "APPSDEV",
        room: "CB206",
        timeStart: "8:00 AM",
        timeEnd: "11:00 AM",
      },
      {
        teacher: {
          firstName: "John",
          lastName: "Doe",
          type: "part-time",
          image:
            "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
        },
        subject: "APPSDEV",
        room: "CB206",
        timeStart: "8:00 AM",
        timeEnd: "11:00 AM",
      },
      {
        teacher: {
          firstName: "John",
          lastName: "Doe",
          type: "part-time",
          image:
            "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
        },
        subject: "APPSDEV",
        room: "CB206",
        timeStart: "8:00 AM",
        timeEnd: "11:00 AM",
      },
      {
        teacher: {
          firstName: "Jane",
          lastName: "Doe",
          type: "full-time",
          image:
            "https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg",
        },
        subject: "NLP",
        room: "CB205",
        timeStart: "8:00 AM",
        timeEnd: "11:00 AM",
      },
      {
        teacher: {
          firstName: "Jana",
          lastName: "Doe",
          type: "full-time",
          image:
            "https://res.cloudinary.com/dppgyhery/image/upload/v1631456016/samples/people/bicycle.jpg",
        },
        subject: "SOFTENG",
        room: "CB205",
        timeStart: "11:00 AM",
        timeEnd: "2:00 PM",
      },
    ],
    []
  );
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
            <div className="flex flex-col justify-center gap-1 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="font-display text-2xl font-semibold">100</p>
            </div>
            <div className="flex flex-col justify-center gap-1 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Part-time Teachers</p>
              <p className="font-display text-2xl font-semibold">100</p>
            </div>
            <div className="flex flex-col justify-center gap-1 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Full-time Teachers</p>
              <p className="font-display text-2xl font-semibold">100</p>
            </div>
            <div className="flex flex-col justify-center gap-1 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Unscheduled Teachers</p>
              <p className="font-display text-2xl font-semibold">100</p>
            </div>
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
