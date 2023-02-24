import { create } from "zustand";

const useNavStore = create((set) => ({
  isMinimized: false,
  isOpen: false,
  setIsMinimized: (payload) =>
    set(() => ({
      isMinimized: payload,
    })),
  setIsOpen: (payload) =>
    set(() => ({
      isOpen: payload,
    })),
}));

export default useNavStore;
