import { create } from 'zustand';

const useKinderSubjectsStore = create((set) => ({
  subjects: [],
  setSubjects: (payload) =>
    set(() => ({
      subjects: payload,
    })),
}));

export default useKinderSubjectsStore;
