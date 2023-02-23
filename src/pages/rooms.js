import Head from "next/head";
import MainLayout from "@/components/Layouts/MainLayout";
import RoomTable from "@/components/Tables/RoomTable";
import { rooms } from "@/lib/test_data/rooms";
import { useMemo } from "react";

export default function Rooms() {
  const roomsData = useMemo(() => rooms, []);
  return (
    <>
      <Head>
        <title>Rooms | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        <div className="overflow-x-auto">
          <RoomTable data={roomsData} />
        </div>
      </div>
    </>
  );
}

Rooms.getLayout = function getLayout(page) {
  return <MainLayout name="Rooms">{page}</MainLayout>;
};
