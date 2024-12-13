import { create } from "zustand";

export const useStore = create((set) => ({
  isLogoLoaded: false,
  setIsLogoLoaded: (isLogoLoaded) => set({ isLogoLoaded }),
  isHeadLoaded: false,
  setIsHeadLoaded: (isHeadLoaded) => set({ isHeadLoaded }),
  activeScene: 1,
  setActiveScene: (activeScene) => set({ activeScene }),
}));
