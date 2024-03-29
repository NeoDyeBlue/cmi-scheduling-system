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
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { ErrorScreen } from '@/components/Misc';
import { createTimePairs } from '@/utils/time-utils';
import { createInitialRoomLayout } from '@/utils/scheduler-utils';

export default function Schedule() {
  const router = useRouter();
  const timeData = useMemo(() => createTimePairs('6:00 AM', '6:00 PM', 30), []);
  const {
    course,
    subjectsData,
    subjectScheds,
    courseSubjects,
    selectedRooms,
    roomsSubjScheds,
    roomsSubjSchedsLayouts,
    oldSchedsData,
    setCourseSubjects,
    setSubjectsData,
    setCourse,
    setSubjectScheds,
    setSelectedRooms,
    setAllRoomSubjSchedsLayout,
    setAllRoomSubjScheds,
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
        roomsSubjScheds: state.roomsSubjScheds,
        roomsSubjSchedsLayouts: state.roomsSubjSchedsLayouts,
        oldSchedsData: state.oldSchedsData,
        setCourseSubjects: state.setCourseSubjects,
        setSubjectsData: state.setSubjectsData,
        setCourse: state.setCourse,
        setSubjectScheds: state.setSubjectScheds,
        setSelectedRooms: state.setSelectedRooms,
        setAllRoomSubjScheds: state.setAllRoomSubjScheds,
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
  const [resetScheduler, setResetScheduler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedulerData, setSchedulerData] = useState(null);

  useEffect(() => {
    if (
      schedulerData?.course?.code !== course?.code ||
      schedulerData?.course?.year !== course?.year ||
      schedulerData?.course?.section !== course?.section ||
      schedulerData?.semester !== course?.semester
    )
      reset();
  }, [schedulerData, course, reset]);

  useEffect(() => {
    async function getSchedulerData() {
      if (Object.keys(router.query).length) {
        try {
          const res = await fetch(
            `/api/courses/${router.query.course}?${new URLSearchParams({
              ..._.pick(router.query, ['semester', 'year', 'section']),
              p: 'draggable',
            }).toString()}`
          );

          const result = await res.json();

          if (result && result.success) {
            setSchedulerData(result?.data[0]);
          } else {
            setError(error);
          }
          setIsLoading(false);
        } catch (error) {
          setError(error);
          setIsLoading(false);
        }
      }
    }
    getSchedulerData();
  }, [router.query]);

  useEffect(
    () => {
      if (schedulerData && !subjectsData.length) {
        const courseSubjectsData = [];
        schedulerData?.subjects?.forEach((subject) => {
          subject?.assignedTeachers?.forEach((teacher) => {
            const dataId = `${subject.code}~${teacher._id}`;
            const { teachers, ...newData } = subject;
            courseSubjectsData.push({
              id: dataId,
              data: {
                ...newData,
                teacher,
                courses: subject.courses,
              },
            });
          });
        });
        const roomLayouts = [];
        schedulerData?.rooms.forEach((room) => {
          const roomLayout = createInitialRoomLayout(
            room.schedules,
            schedulerData?.course,
            schedulerData?.subjects,
            timeData
          );
          roomLayouts.push({
            roomCode: room.code,
            roomId: room._id,
            layout: roomLayout,
          });
        });
        setAllRoomSubjSchedsLayout(roomLayouts);
        setCourseSubjects(schedulerData?.subjects);
        setCourse({
          ...schedulerData?.course,
          semester: schedulerData?.semester,
        });
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
            const dataId = `${schedule.subject.code}~${schedule.teacher._id}`;
            if (
              !subjectsData.some((data) => data.id == dataId) &&
              !roomSubjectsData.some((data) => data.id == dataId)
            ) {
              roomSubjectsData.push({
                id: dataId,
                data: {
                  ...schedule.subject,
                  teacher: schedule.teacher,
                  courses: schedule.subject.courses,
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
    // const rooms = roomsSubjSchedsLayouts.map((room) => room.roomId);
    setFormData({
      course,
      roomSchedules: roomsSubjScheds,
      semester: schedulerData?.semester,
    });
  }, [course, roomsSubjScheds, schedulerData?.semester]);

  const draggableSchedules = useMemo(
    () =>
      courseSubjects.map((subject, subjIndex) => {
        const { teachers, ...newData } = subject;
        if (subject.assignedTeachers.length) {
          return subject?.assignedTeachers.map((teacher, teacherIndex) => (
            <DraggableSchedule
              key={`${teacher.id}-${subjIndex}-${teacherIndex}`}
              data={{ ...newData, teacher, course }}
            />
          ));
        } else {
          return (
            <DraggableSchedule
              key={subjIndex}
              data={{ ...newData, teacher: null, course }}
            />
          );
        }
      }),
    [subjectsData]
  );

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

  const selectedRoomTabs = selectedRooms.map((room, index) => (
    <Tab
      key={`${room.code}-${index}`}
      className="tab group relative uppercase"
      selectedClassName="tab-active"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setToRemoveRoom(room._id);
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
        onMerge={submitChanges}
      />
    </TabPanel>
  ));

  function checkForChanges() {
    const hasChanges = _.isEqual(roomsSubjScheds, oldSchedsData);
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
        setOldSchedsData(_.sortBy(roomsSubjScheds, 'roomCode'));
        setSchedulerData(result.data[0]);
        /**
         * ILL ADD A STATE UPDATE HERE FOR THE SCHEDULER DATA
         */
        // mutate();
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

  async function onConfirmReset() {
    setIsResetConfirmOpen(false);
    setResetScheduler(true);
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/schedules/reset?${new URLSearchParams({
          course: course._id,
          year: course.year,
          section: course.section,
          semester: course.semester,
        }).toString()}`,
        { method: 'DELETE' }
      );

      const result = await res.json();
      if (result?.success) {
        setAllRoomSubjSchedsLayout([]);
        setSelectedRooms([]);
        setSubjectScheds([]);
        setAllRoomSubjScheds([]);
        setSubjectsData(
          subjectsData.map((subjectData) => ({
            ...subjectData,
            data: {
              ...subjectData.data,
              teacher: {
                assignedCourses:
                  subjectData.data.teacher.assignedCourses.filter(
                    (assignedCourse) =>
                      assignedCourse.code == course.code &&
                      assignedCourse.year == course.year &&
                      assignedCourse.section == course.section
                  ),
              },
            },
          }))
        );
        setFormData({
          course,
          roomSchedules: [],
          semester: schedulerData?.semester,
        });
        toast.success('Schedules reset');
      } else {
        toast.error("Can't reset schedules");
      }
      setIsSubmitting(false);
      setResetScheduler(false);
    } catch (error) {
      setIsSubmitting(false);
      setResetScheduler(false);
      toast.error("Can't reset schedules");
    }
  }

  async function onConfirmRemoveRoom() {
    setIsRemoveRoomConfirmOpen(false);
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/schedules?${new URLSearchParams({
          room: toRemoveRoom,
          course: course._id,
          year: course.year,
          section: course.section,
          semester: course.semester,
        }).toString()}`,
        { method: 'DELETE' }
      );

      const result = await res.json();

      if (result?.success) {
        const newSubjScheds = subjectScheds
          .map((subjectSched) => ({
            ...subjectSched,
            schedules: [
              ...subjectSched.schedules.filter(
                (schedule) => schedule.room._id !== toRemoveRoom
              ),
            ],
          }))
          .filter((items) => items.schedules.length);

        const newRoomsSubjScheds = roomsSubjScheds.filter(
          (room) => room.roomId !== toRemoveRoom
        );

        const newSubjectsData = [];
        subjectsData.forEach((subjectData) => {
          const subjScheds = newRoomsSubjScheds
            .map((room) => room.schedules)
            .flat()
            .filter(
              (schedule) =>
                `${schedule.subject.code}~${schedule.teacher._id}` ==
                subjectData.id
            );

          if (
            subjScheds.length ||
            schedulerData?.subjects.some(
              (subject) => subject._id == subjectData.data._id
            )
          ) {
            if (!subjScheds.length) {
              newSubjectsData.push({
                ...subjectData,
                data: {
                  ...subjectData.data,
                  teacher: {
                    ...subjectData.data.teacher,
                    assignedCourses:
                      subjectData.data.teacher.assignedCourses.filter(
                        (assignedCourse) =>
                          assignedCourse.code == course.code &&
                          assignedCourse.year == course.year &&
                          assignedCourse.section == course.section
                      ),
                  },
                },
              });
            } else {
              newSubjectsData.push(subjectData);
            }
          }
        });

        setFormData({
          course,
          roomSchedules: newRoomsSubjScheds,
          semester: schedulerData?.semester,
        });
        setSubjectScheds(newSubjScheds);
        setAllRoomSubjScheds(_.sortBy(newRoomsSubjScheds, 'roomCode'));
        setSelectedRooms(
          selectedRooms.filter((room) => room._id !== toRemoveRoom)
        );
        setAllRoomSubjSchedsLayout(
          roomsSubjSchedsLayouts.filter(
            (roomLayout) => roomLayout.roomId !== toRemoveRoom
          )
        );
        setSubjectsData(newSubjectsData);
        toast.success('Room removed');
      } else {
        toast.error("Can't remove room");
      }
      setIsSubmitting(false);
      setToRemoveRoom('');
    } catch (error) {
      setIsSubmitting(false);
      setToRemoveRoom('');
      toast.error("Can't remove room");
    }
  }

  return (
    <>
      <PopupLoader
        isOpen={isSubmitting}
        message={
          toRemoveRoom
            ? 'Removing room...'
            : resetScheduler
            ? 'Resetting schedules...'
            : 'Saving schedules...'
        }
      />
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
              Creating {schedulerData?.semester == '1' ? '1st semester' : ''}
              {schedulerData?.semester == '2' ? '2nd semester' : ''}
              {schedulerData?.semester == 'special' ? 'special' : ''}
              {schedulerData?.semester == 'summer' ? 'summer' : ''} schedules
              for:
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
              disabled={_.isEqual(roomsSubjScheds, oldSchedsData)}
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
