import { create } from 'zustand';

const useSchedulerStore = create((set, get) => ({
  subjects: [],
  subjectScheds: [],
  draggingSubject: null,
  resizingSubject: null,
  layouts: [],
  currentRoom: '',
  setDraggingSubject: (subject) =>
    set(() => ({
      draggingSubject: subject,
    })),
  setResizingSubject: (subject) =>
    set(() => ({
      resizingSubject: subject,
    })),
  setSubjects: (payload) =>
    set(() => ({
      subjects: payload,
    })),
  setSubjectScheds: (payload) =>
    set(() => ({
      subjectScheds: payload,
    })),
  setCurrentRoom: (payload) =>
    set(() => ({
      currentRoom: payload,
    })),
  setLayout: (roomCode, layout) => {
    const filteredLayouts = get().layouts.filter(
      (layoutObj) => layoutObj.roomCode !== roomCode
    );
    set(() => ({
      layouts: [...filteredLayouts, { roomCode, layout }],
    }));
  },
}));

export default useSchedulerStore;
