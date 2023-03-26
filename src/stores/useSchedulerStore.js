import { create } from 'zustand';

const useSchedulerStore = create((set, get) => ({
  course: null,
  courseSubjects: [],
  subjectsData: [],
  draggingSubject: null,
  selectedRooms: [],
  subjectScheds: [],
  roomsSubjSchedsLayouts: [],
  oldSchedsData: null,
  setCourse: (payload) =>
    set(() => ({
      course: payload,
    })),
  setCourseSubjects: (payload) =>
    set(() => ({
      courseSubjects: payload,
    })),
  setDraggingSubject: (subject) =>
    set(() => ({
      draggingSubject: subject,
    })),
  setSubjectScheds: (payload) =>
    set(() => ({
      subjectScheds: payload,
    })),
  setSubjectsData: (payload) =>
    set(() => ({
      subjectsData: payload,
    })),
  setSelectedRooms: (payload) =>
    set(() => ({
      selectedRooms: payload,
    })),
  setAllRoomSubjSchedsLayout: (payload) => {
    set(() => ({
      roomsSubjSchedsLayouts: payload,
    }));
  },
  setRoomSubjSchedsLayout: (roomCode, layout) => {
    const filteredLayouts = get().roomsSubjSchedsLayouts.filter(
      (layoutObj) => layoutObj.roomCode !== roomCode
    );
    set(() => ({
      roomsSubjSchedsLayouts: [...filteredLayouts, { roomCode, layout }],
    }));
  },
  setOldSchedsData: (payload) => {
    set(() => ({
      oldSchedsData: payload,
    }));
  },
}));

export default useSchedulerStore;
