import { create } from 'zustand';

const useSchedulerStore = create((set) => ({
  draggingSchedule: null,
  setDraggingSchedule: null,
  setDraggingSchedule: (schedule) =>
    set(() => ({
      draggingSchedule: schedule,
    })),
}));

export default useSchedulerStore;
