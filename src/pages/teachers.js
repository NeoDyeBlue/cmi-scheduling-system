import Head from "next/head";
import MainLayout from "@/components/Layouts/MainLayout";

export default function Teachers() {
  return (
    <>
      <Head>
        <title>Teachers | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold capitalize md:text-3xl">
            Teachers
          </h1>
        </div>
      </div>
    </>
  );
}

Teachers.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
