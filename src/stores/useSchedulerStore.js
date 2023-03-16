import { create } from 'zustand';

const useSchedulerStore = create((set) => ({
  subjects: [],
  subjectScheds: [],
  draggingSubject: null,
  resizingSubject: null,
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
}));

export default useSchedulerStore;
