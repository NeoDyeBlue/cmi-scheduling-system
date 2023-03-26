import Head from 'next/head';
import {
  MdAdd,
  MdClose,
  MdRestartAlt,
  MdAccessTimeFilled,
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Scheduler } from '@/components/Inputs';
import DraggableSchedule from '@/components/Misc/DraggableSchedule';
import { useEffect, useState, useCallback, useMemo } from 'react';
import useSchedulerStore from '@/stores/useSchedulerStore';
import { RoomSelector, Modal } from '@/components/Modals';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SquareButton, Button } from '@/components/Buttons';
import { Confirmation } from '@/components/Modals';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { FullPageLoader } from '@/components/Loaders';
import useSWRImmutable from 'swr/immutable';
import _ from 'lodash';

export default function Schedule() {
  const router = useRouter();
  const {
    course,
    subjectsData,
    subjectScheds,
    courseSubjects,
    selectedRooms,
    roomsSubjSchedsLayouts,
    oldSchedsData,
    setCourseSubjects,
    setSubjectsData,
    setCourse,
    setSubjectScheds,
    setSelectedRooms,
    setAllRoomSubjSchedsLayout,
  } = useSchedulerStore(
    useCallback(
      (state) => ({
        course: state.course,
        subjectsData: state.subjectsData,
        subjectScheds: state.subjectScheds,
        courseSubjects: state.courseSubjects,
        selectedRooms: state.selectedRooms,
        roomsSubjSchedsLayouts: state.roomsSubjSchedsLayouts,
        oldSchedsData: state.oldSchedsData,
        setCourseSubjects: state.setCourseSubjects,
        setSubjectsData: state.setSubjectsData,
        setCourse: state.setCourse,
        setSubjectScheds: state.setSubjectScheds,
        setSelectedRooms: state.setSelectedRooms,
        setAllRoomSubjSchedsLayout: state.setAllRoomSubjSchedsLayout,
      }),
      []
    ),
    shallow
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const { course: courseCode, semester, year, section } = router.query;
  const {
    data: result,
    isLoading,
    error,
  } = useSWRImmutable(
    `/api/courses/${courseCode}?${new URLSearchParams({
      semester,
      year,
      section,
      p: 'draggable',
    }).toString()}`
  );

  const schedulerData = useMemo(
    () => (result?.data ? result.data : null),
    [result]
  );

  useEffect(() => {
    if (schedulerData) {
      setCourseSubjects(schedulerData?.subjects);
      setCourse(schedulerData?.course);
      const courseSubjectsData = [];
      schedulerData?.subjects?.forEach((subject) => {
        subject?.assignedTeachers?.forEach((teacher) => {
          const dataId = `${subject.code}~${teacher.id}`;
          const { teachers, ...newData } = subject;
          courseSubjectsData.push({
            id: dataId,
            data: { ...newData, teacher },
          });
        });
      });
      setSubjectsData(courseSubjectsData);
    }
  }, [setCourseSubjects, setSubjectsData, setCourse, result]);

  useEffect(() => {
    if (subjectsData.length) {
      const roomSubjectsData = [];
      selectedRooms.forEach((room) => {
        room.schedules.forEach((schedule) => {
          const dataId = `${schedule.subject.code}~${schedule.teacher.id}`;
          if (
            !subjectsData.some((data) => data.id == dataId) &&
            !roomSubjectsData.some((data) => data.id == dataId)
          ) {
            roomSubjectsData.push({
              id: `${schedule.subject.code}~${schedule.teacher.id}`,
              data: {
                ...schedule.subject,
                teacher: schedule.teacher,
              },
            });
          }
        });
      });
      setSubjectsData([...subjectsData, ...roomSubjectsData]);
    }
  }, [selectedRooms]);

  if (!schedulerData || isLoading) {
    return <FullPageLoader message="Getting scheduler data please wait..." />;
  }

  const draggableSchedules = courseSubjects.map((subject, subjIndex) => {
    const { teachers, ...newData } = subject;
    return subject?.assignedTeachers.map((teacher, teacherIndex) => (
      <DraggableSchedule
        key={`${teacher.id}-${subjIndex}-${teacherIndex}`}
        data={{ ...newData, teacher }}
      />
    ));
  });

  const selectedRoomTabs = selectedRooms.map((room, index) => (
    <Tab
      key={`${room.code}-${index}`}
      className="tab group relative"
      selectedClassName="tab-active"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeRoom(room.code);
        }}
        className="absolute top-0 right-0 m-1 hidden h-[20px] w-[20px] items-center 
              justify-center rounded-full border border-gray-200 bg-white text-center 
              text-ship-gray-900 group-hover:flex"
      >
        <MdClose size={16} />
      </button>
      {room.code}
    </Tab>
  ));

  const selectedRoomTabPanels = selectedRooms.map((room) => (
    <TabPanel key={`${room.code}`} className="-ml-[1px] -mt-[1px]">
      <Scheduler
        startTime="6:00 AM"
        endTime="6:00 PM"
        interval={30}
        roomCode={room.code}
        roomSchedules={room.schedules}
      />
    </TabPanel>
  ));

  function removeRoom(roomCode) {
    setSubjectScheds(
      subjectScheds
        .map((subjectSched) => ({
          ...subjectSched,
          schedules: [
            ...subjectSched.schedules.filter(
              (schedule) => schedule.roomCode !== roomCode
            ),
          ],
        }))
        .filter((items) => items.schedules.length)
    );
    setSelectedRooms(selectedRooms.filter((room) => room.code !== roomCode));
    setAllRoomSubjSchedsLayout(
      roomsSubjSchedsLayouts.filter(
        (roomLayout) => roomLayout.roomCode !== roomCode
      )
    );
  }

  function checkForChanges() {
    router.push('/scheduler');
  }

  function submitChanges() {
    const formData = {
      course,
      subjectScheds,
    };

    console.log(formData, oldSchedsData);
    console.log(_.isEqual(formData, oldSchedsData));
  }

  function onConfirmReset() {}

  return (
    <>
      <Confirmation
        isOpen={isResetConfirmOpen}
        onCancel={() => setIsResetConfirmOpen(false)}
        label="Reset Subject Schedules?"
        message="This will remove all placed subject schedules from every rooms."
      />
      <Head>
        <title>Schedule | CMI - Scheduler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal
        label="Add a Room"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <RoomSelector onSelectClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="relative grid h-screen grid-cols-1 grid-rows-[auto_1fr] overflow-hidden">
        <div className="flex items-center gap-4 border-b border-gray-300 p-4">
          <Link
            href="/scheduler"
            className="flex items-center justify-center rounded-lg bg-gradient-to-br
             from-primary-600 to-primary-900 p-2 text-white hover:shadow-md"
          >
            <MdAccessTimeFilled size={24} />
          </Link>
          <div>
            <p className="text-sm">
              Creating{' '}
              {schedulerData?.semester == '1' ? '1st semester' : '2nd semester'}{' '}
              schedules for:
            </p>
            <h1 className="font-display text-xl font-semibold">
              {schedulerData?.course.code}: {schedulerData?.course.name}{' '}
              {schedulerData?.course.year}
              {schedulerData?.course.section}
            </h1>
          </div>
          <div className="ml-auto flex gap-2">
            <Button secondary small onClick={checkForChanges}>
              Cancel
            </Button>
            <Button small onClick={submitChanges}>
              Done
            </Button>
          </div>
        </div>
        <div className="relative flex min-h-full w-full">
          <Tabs
            className="flex max-h-full w-full"
            // onSelect={(index) => console.log(index)}
          >
            <div className="flex w-fit min-w-[150px] flex-col border-r border-gray-300">
              <div className="w-full p-4">
                <Button
                  fullWidth
                  small
                  secondary
                  onClick={() => setIsModalOpen(true)}
                >
                  <MdAdd size={20} /> Room
                </Button>
              </div>
              <Scrollbars style={{ height: '100%' }} universal autoHide>
                <TabList className="custom-scrollbar flex max-h-full w-full flex-col gap-2 overflow-y-auto px-4 pb-4">
                  {selectedRoomTabs}
                </TabList>
              </Scrollbars>
            </div>
            <div className="w-full">
              {!selectedRooms.length ? (
                <div
                  className="flex h-full items-center justify-center
                 text-center text-gray-400"
                >
                  <p className="text-xl">Select a room for scheduling</p>
                </div>
              ) : (
                <Scrollbars style={{ height: '100%' }} universal autoHide>
                  {selectedRoomTabPanels}
                </Scrollbars>
              )}
            </div>
          </Tabs>
          <Scrollbars
            universal
            autoHide
            style={{ height: '100%' }}
            className="max-w-[230px] border-l border-gray-300"
          >
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-lg font-semibold">Subjects</p>
                <SquareButton
                  icon={<MdRestartAlt size={20} />}
                  toolTipId="reset"
                  toolTipContent="Reset"
                  onClick={() => setIsResetConfirmOpen(true)}
                />
              </div>
              <ul className="flex flex-col gap-4">
                {draggableSchedules.flat()}
              </ul>
            </div>
          </Scrollbars>
        </div>
      </div>
    </>
  );
}
