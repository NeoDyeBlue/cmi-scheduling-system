import Head from "next/head";
import { MainLayout } from "@/components/Layouts";

export default function Schedules() {
  return (
    <>
      <Head>
        <title>Schedules | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6"></div>
    </>
  );
}

Schedules.getLayout = function getLayout(page) {
  return <MainLayout name="Schedules">{page}</MainLayout>;
};
