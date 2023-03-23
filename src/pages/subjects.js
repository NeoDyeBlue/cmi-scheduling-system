import Head from 'next/head';
import { MainLayout } from '@/components/Layouts';
import { SearchForm, SubjectForm } from '@/components/Forms';
import { useState } from 'react';
import { CreateButton } from '@/components/Buttons';
import { Modal } from '@/components/Modals';
import { SubjectTable } from '@/components/Tables';
import usePaginate from '@/hooks/usePaginate';
import ReactPaginate from 'react-paginate';

export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { docs, pageData, setPageIndex, mutate } = usePaginate({
    url: '/api/subjects',
    limit: 10,
  });
  return (
    <>
      <Head>
        <title>Subjects | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-6 p-6">
        <Modal
          label="New Subject"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <SubjectForm
            onCancel={() => setIsModalOpen(false)}
            onAfterSubmit={() => {
              setIsModalOpen(false);
              mutate();
            }}
          />
        </Modal>
        <div className="flex items-center justify-between gap-4">
          <SearchForm placeholder="Search Subjects" />
          <CreateButton
            onClick={() => setIsModalOpen(true)}
            text="New Subject"
          />
        </div>
        <div className="flex flex-col gap-4 overflow-x-auto">
          <SubjectTable data={docs} onAfterEditSubmit={() => mutate()} />
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
        </div>
      </div>
    </>
  );
}

Subjects.getLayout = function getLayout(page) {
  return <MainLayout name="Subjects">{page}</MainLayout>;
};
