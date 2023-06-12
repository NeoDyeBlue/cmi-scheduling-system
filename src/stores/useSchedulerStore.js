import { create } from 'zustand';

const initialState = {
  classData: null,
  classSubjects: [],
  mergedClasses: [],
  subjectsData: [],
  draggingSubject: null,
  selectedRooms: [],
  subjectScheds: [],
  roomsSubjScheds: [],
  roomsSubjSchedsLayouts: [],
  hoveredMergeable: '',
  oldSchedsData: [],
};

const useSchedulerStore = create((set, get) => ({
  ...initialState,
  setClassData: (payload) =>
    set(() => ({
      classData: payload,
    })),
  setClassSubjects: (payload) =>
    set(() => ({
      classSubjects: payload,
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
  setMergedClasses: (payload) => {
    set(() => ({
      mergedClasses: payload,
    }));
  },
  setAllRoomSubjScheds: (payload) => {
    set(() => ({
      roomsSubjScheds: payload,
    }));
  },
  setRoomSubjSchedsLayout: (roomCode, roomId, layout) => {
    const filteredLayouts = get().roomsSubjSchedsLayouts.filter(
      (layoutObj) => layoutObj.roomCode !== roomCode
    );
    set(() => ({
      roomsSubjSchedsLayouts: [
        ...filteredLayouts,
        { roomCode, roomId, layout },
      ],
    }));
  },
  setRoomSubjScheds: (roomCode, roomId, schedules) => {
    const filteredSchedules = get().roomsSubjScheds.filter(
      (roomSched) => roomSched.roomCode !== roomCode
    );
    set(() => ({
      roomsSubjScheds: [...filteredSchedules, { roomCode, roomId, schedules }],
    }));
  },
  setHoveredMergeable: (payload) => {
    set(() => ({
      hoveredMergeable: payload,
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
