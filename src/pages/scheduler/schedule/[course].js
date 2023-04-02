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
import { useRouter } from 'next/router';
import { shallow } from 'zustand/shallow';
import { FullPageLoader, PopupLoader } from '@/components/Loaders';
import useSWR from 'swr';
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { ErrorScreen } from '@/components/Misc';
import { createTimePairs } from '@/utils/time-utils';
import { nanoid } from 'nanoid';

export default function Schedule() {
  const router = useRouter();
  const timeData = useMemo(() => createTimePairs('6:00 AM', '6:00 PM', 30), []);
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
    setRoomSubjSchedsLayout,
    setOldSchedsData,
    reset,
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
        setOldSchedsData: state.setOldSchedsData,
        setRoomSubjSchedsLayout: state.setRoomSubjSchedsLayout,
        reset: state.reset,
      }),
      []
    ),
    shallow
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRemoveRoomConfirmOpen, setIsRemoveRoomConfirmOpen] = useState(false);
  const [toRemoveRoom, setToRemoveRoom] = useState('');
  const [removeRoom, setRemoveRoom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const { course: courseCode, semester, year, section } = router.query;
  const {
    data: result,
    isLoading,
    error,
  } = useSWR(
    Object.keys(router.query).length
      ? `/api/courses/${courseCode}?${new URLSearchParams({
          semester,
          year,
          section,
          p: 'draggable',
        }).toString()}`
      : null,
    null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
    }
  );

  const schedulerData = useMemo(
    () => (result?.data[0] ? result.data[0] : null),
    [result]
  );

  useEffect(
    () => {
      if (schedulerData && !subjectsData.length) {
        const courseSubjectsData = [];
        // const initialSubjectScheds = [];
        schedulerData?.subjects?.forEach((subject) => {
          subject?.assignedTeachers?.forEach((teacher) => {
            //add to course subjects data
            const dataId = `${subject.code}~${teacher.teacherId}~${schedulerData?.course.code}${schedulerData?.course.year}${schedulerData?.course.section}`;
            const { teachers, ...newData } = subject;
            courseSubjectsData.push({
              id: dataId,
              data: { ...newData, teacher, course: schedulerData?.course },
            });

            //check if addable to initial subject scheds
            // if (teacher.existingSchedules.length) {
            //   const courseSubjectSchedules = [];
            //   teacher.existingSchedules.forEach((dayTimes) => {
            //     const subjectTimes = [];

            //     dayTimes.times.forEach((time) => {
            //       if (
            //         `${schedulerData.course.code}${schedulerData.course.year}${schedulerData.course.section}` ==
            //           `${time.course.code}${time.course.year}${time.course.section}` &&
            //         time.subject.code == subject.code
            //       ) {
            //         subjectTimes.push({ start: time.start, end: time.end });
            //       }
            //     });

            //     if (subjectTimes.length) {
            //       courseSubjectSchedules.push({
            //         day: dayTimes.day,
            //         room: dayTimes.room,
            //         times: subjectTimes,
            //       });
            //     }
            //   });

            //   if (courseSubjectSchedules.length) {
            //     initialSubjectScheds.push({
            //       subject: {
            //         _id: subject._id,
            //         code: subject.code,
            //       },
            //       teacher: {
            //         _id: teacher._id,
            //         teacherId: teacher.teacherId,
            //       },
            //       schedules: courseSubjectSchedules,
            //     });
            //   }
            // }
          });
        });
        const roomLayouts = [];
        schedulerData?.rooms.forEach((room) => {
          const roomLayout = createInitialRoomLayout(
            room.schedules,
            schedulerData?.course,
            schedulerData?.subjects
          );
          roomLayouts.push({
            roomCode: room.code,
            roomId: room._id,
            layout: roomLayout,
          });
        });
        console.log(roomLayouts);
        setAllRoomSubjSchedsLayout(roomLayouts);
        // setSubjectScheds(initialSubjectScheds);
        // setOldSchedsData(initialSubjectScheds);
        setCourseSubjects(schedulerData?.subjects);
        setCourse(schedulerData?.course);
        setSubjectsData(courseSubjectsData);
        setSelectedRooms(schedulerData?.rooms);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schedulerData]
  );

  useEffect(
    () => {
      if (subjectsData.length) {
        const roomSubjectsData = [];
        selectedRooms.forEach((room) => {
          room.schedules.forEach((schedule) => {
            const dataId = `${schedule.subject.code}~${schedule.teacher.teacherId}~${schedule.course.code}${schedule.course.year}${schedule.course.section}`;
            if (
              !subjectsData.some((data) => data.id == dataId) &&
              !roomSubjectsData.some((data) => data.id == dataId)
            ) {
              roomSubjectsData.push({
                id: dataId,
                data: {
                  ...schedule.subject,
                  teacher: schedule.teacher,
                  course: schedule.course,
                },
              });
            }
          });
        });
        setSubjectsData([...subjectsData, ...roomSubjectsData]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRooms]
  );

  useEffect(() => {
    const rooms = roomsSubjSchedsLayouts.map((room) => room.roomId);
    setFormData({
      course,
      subjectScheds,
      rooms,
      semester: schedulerData?.semester,
    });
  }, [course, subjectScheds, roomsSubjSchedsLayouts, schedulerData?.semester]);

  useEffect(
    () => {
      if (removeRoom) {
        submitChanges().then(() => {
          setToRemoveRoom('');
          setIsRemoveRoomConfirmOpen(false);
          setRemoveRoom(false);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [removeRoom]
  );

  function createInitialRoomLayout(
    roomSchedules,
    courseData,
    toCheckCourseSubjects
  ) {
    //get the existing room layout
    const roomSubjectsLayout = [];
    //for each subject schedule
    roomSchedules?.forEach((subjSchedule) => {
      subjSchedule.dayTimes.forEach((dayTime) => {
        //for each times of the day
        dayTime.times.forEach((time) => {
          const yStart =
            timeData.findIndex((timePairs) => timePairs[0] == time.start) + 1;
          const yEnd =
            timeData.findIndex((timePairs) => timePairs[1] == time.end) + 1;
          roomSubjectsLayout.push({
            i: `${subjSchedule.subject.code}~${
              subjSchedule.teacher.teacherId
            }~${subjSchedule.course.code}${subjSchedule.course.year}${
              subjSchedule.course.section
            }~${nanoid(10)}`,
            x: dayTime.day,
            w: 1,
            y: yStart,
            minH: 1,
            h: Math.abs(yEnd - yStart) + 1,
            maxW: 1,
            /**
             * will be static only if:
             * - subject is not in the courseSubjects
             * - if subject is in the courseSubjects, check if it has the same year and section
             */
            static:
              !toCheckCourseSubjects.some(
                (subject) => subject.code == subjSchedule.subject.code
              ) ||
              `${courseData.code}${courseData.year}${courseData.section}` !==
                `${subjSchedule.course.code}${subjSchedule.course.year}${subjSchedule.course.section}`,
          });
        });
      });
    });
    // setSubjectsData(roomSubjectsData);
    return roomSubjectsLayout;
  }

  if (!schedulerData && isLoading) {
    return <FullPageLoader message="Getting scheduler data please wait..." />;
  }

  if (error && !isLoading) {
    return (
      <ErrorScreen
        message="Something went wrong"
        returnUrl="/scheduler"
        returnUrlMessage="Back to Scheduler"
      />
    );
  }

  const draggableSchedules = courseSubjects.map((subject, subjIndex) => {
    const { teachers, ...newData } = subject;
    return subject?.assignedTeachers.map((teacher, teacherIndex) => (
      <DraggableSchedule
        key={`${teacher.id}-${subjIndex}-${teacherIndex}`}
        data={{ ...newData, teacher, course }}
      />
    ));
  });

  const selectedRoomTabs = selectedRooms.map((room, index) => (
    <Tab
      key={`${room.code}-${index}`}
      className="tab group relative uppercase"
      selectedClassName="tab-active"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setToRemoveRoom(room.code);
          setIsRemoveRoomConfirmOpen(true);
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
        semester={schedulerData?.semester}
        roomData={room}
      />
    </TabPanel>
  ));

  function checkForChanges() {
    const hasChanges = _.isEqual(subjectScheds, oldSchedsData);
    if (!hasChanges && oldSchedsData.length) {
      setIsCancelConfirmOpen(true);
    } else {
      router.push('/scheduler');
      reset();
    }
  }

  async function submitChanges() {
    console.log({
      ...formData,
      // semester: schedulerData?.semester,
    });
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/schedules', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (result?.success) {
        toast.success('Schedules saved');
        setOldSchedsData(subjectScheds);
      } else if (!result.success) {
        toast.error("Can't save schedules");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      toast.error("Can't save schedules");
    }
  }

  function onConfirmReset() {
    setAllRoomSubjSchedsLayout(
      roomsSubjSchedsLayouts.map((roomLayout) => ({
        roomCode: roomLayout.roomCode,
        layout: roomLayout.layout.filter((item) => item.static),
      }))
    );
    setSubjectScheds([]);
  }

  function onConfirmRemoveRoom() {
    const newSubjScheds = subjectScheds
      .map((subjectSched) => ({
        ...subjectSched,
        schedules: [
          ...subjectSched.schedules.filter(
            (schedule) => schedule.room.code !== toRemoveRoom
          ),
        ],
      }))
      .filter((items) => items.schedules.length);
    setFormData({ course, subjectScheds: newSubjScheds });
    setSubjectScheds(newSubjScheds);
    setSelectedRooms(
      selectedRooms.filter((room) => room.code !== toRemoveRoom)
    );
    setAllRoomSubjSchedsLayout(
      roomsSubjSchedsLayouts.filter(
        (roomLayout) => roomLayout.roomCode !== toRemoveRoom
      )
    );

    setRemoveRoom(true);
  }

  // console.log('old', oldSchedsData);
  // console.log('new', subjectScheds);

  return (
    <>
      <PopupLoader isOpen={isSubmitting} message="Saving schedules..." />
      <Confirmation
        isOpen={isResetConfirmOpen}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={onConfirmReset}
        label="Reset Subject Schedules?"
        message="This will remove all placed subject schedules from every rooms."
      />
      <Confirmation
        isOpen={isRemoveRoomConfirmOpen}
        onCancel={() => {
          setIsRemoveRoomConfirmOpen(false);
          setToRemoveRoom('');
        }}
        onConfirm={onConfirmRemoveRoom}
        label="Remove Room?"
        message="This will remove the placed subject schedules in this room."
      />
      <Confirmation
        isOpen={isCancelConfirmOpen}
        onCancel={() => setIsCancelConfirmOpen(false)}
        onConfirm={() => {
          router.push('/scheduler');
          reset();
        }}
        label="Discard Changes?"
        message="Are you sure to not save your changes before leaving?"
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
        <RoomSelector
          onSelectClose={() => setIsModalOpen(false)}
          semester={schedulerData?.semester}
        />
      </Modal>
      <div className="relative grid h-screen grid-cols-1 grid-rows-[auto_1fr] overflow-hidden">
        <div className="flex items-center gap-4 border-b border-gray-300 p-4">
          <button
            onClick={checkForChanges}
            href="/scheduler"
            className="flex items-center justify-center rounded-lg bg-gradient-to-br
             from-primary-600 to-primary-900 p-2 text-white hover:shadow-md"
          >
            <MdAccessTimeFilled size={24} />
          </button>
          <div>
            <p className="text-sm">
              Creating{' '}
              {schedulerData?.semester == '1' ? '1st semester' : '2nd semester'}{' '}
              schedules for:
            </p>
            <h1 className="font-display text-xl font-semibold">
              {schedulerData?.course.code.toUpperCase()}:{' '}
              {schedulerData?.course.name} {schedulerData?.course.year}
              {schedulerData?.course.section}
            </h1>
          </div>
          <div className="ml-auto flex gap-2">
            <Button secondary small onClick={checkForChanges}>
              Cancel
            </Button>
            <Button
              small
              onClick={submitChanges}
              disabled={_.isEqual(subjectScheds, oldSchedsData)}
            >
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
