import { create } from "zustand";

const useNavStore = create((set) => ({
  isMinimized: false,
  width: 0,
  setIsMinimized: (payload) =>
    set(() => ({
      isMinimized: payload,
    })),
  setWidth: (payload) =>
    set(() => ({
      width: payload,
    })),
}));

export default useNavStore;
