import { create } from 'zustand';

const initialState = {
  course: null,
  courseSubjects: [],
  subjectsData: [],
  draggingSubject: null,
  selectedRooms: [],
  subjectScheds: [],
  roomsSubjSchedsLayouts: [],
  oldSchedsData: [],
};

const useSchedulerStore = create((set, get) => ({
  ...initialState,
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
  setRoomSubjSchedsLayout: (roomCode, roomId, layout) => {
    const filteredLayouts = get().roomsSubjSchedsLayouts.filter(
      (layoutObj) => layoutObj.roomCode !== roomCode
    );
    console.log(roomCode, roomId, layout);
    set(() => ({
      roomsSubjSchedsLayouts: [
        ...filteredLayouts,
        { roomCode, roomId, layout },
      ],
    }));
  },
  setOldSchedsData: (payload) => {
    set(() => ({
      oldSchedsData: payload,
    }));
  },
  reset: () => {
    set(initialState);
  },
}));

export default useSchedulerStore;
