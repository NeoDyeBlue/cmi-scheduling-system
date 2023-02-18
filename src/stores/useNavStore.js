import { create } from "zustand";

const useNavStore = create((set) => ({
  isMinimized: false,
  setIsMinimized: (payload) =>
    set(() => ({
      isMinimized: payload,
    })),
}));

export default useNavStore;
