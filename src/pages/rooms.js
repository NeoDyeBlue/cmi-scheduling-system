import Head from 'next/head';
import { MainLayout } from '@/components/Layouts';
import { RoomTable } from '@/components/Tables';
import { SearchForm } from '@/components/Forms';
import { CreateButton } from '@/components/Buttons';
import { useState } from 'react';
import { Modal } from '@/components/Modals';
import { RoomForm } from '@/components/Forms';
import usePaginate from '@/hooks/usePaginate';
import ReactPaginate from 'react-paginate';
import { SpinnerLoader } from '@/components/Loaders';

export default function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { docs, pageData, setPageIndex, mutate, isLoading } = usePaginate({
    url: '/api/rooms',
    limit: 10,
  });
  return (
    <>
      <Head>
        <title>Rooms | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        <Modal
          label="New Room"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <RoomForm
            onCancel={() => setIsModalOpen(false)}
            onAfterSubmit={() => {
              setIsModalOpen(false);
              mutate();
            }}
          />
        </Modal>
        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-[350px]">
            <SearchForm placeholder="Search rooms" />
          </div>
          <CreateButton onClick={() => setIsModalOpen(true)} text="New Room" />
        </div>
        <div className="flex flex-col gap-4">
          {isLoading && !docs?.length ? <SpinnerLoader size={36} /> : null}
          {!isLoading && !docs.length ? (
            <p className="mx-auto py-6 text-center text-ship-gray-500">
              Nothing to show
            </p>
          ) : null}
          {!isLoading && docs.length ? (
            <>
              <div className="overflow-x-auto">
                <RoomTable data={docs} mutate={() => mutate()} />
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={({ selected }) => setPageIndex(selected + 1)}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(pageData?.totalPages) || 0}
                previousLabel="< prev"
                renderOnZeroPageCount={null}
                containerClassName="paginate-container"
                previousLinkClassName="paginate-button"
                nextLinkClassName="paginate-button"
                pageLinkClassName="paginate-link"
                activeLinkClassName="paginate-link-active"
                breakLinkClassName="paginate-break"
                disabledLinkClassName="paginate-link-disabled"
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

Rooms.getLayout = function getLayout(page) {
  return <MainLayout name="Rooms">{page}</MainLayout>;
};
