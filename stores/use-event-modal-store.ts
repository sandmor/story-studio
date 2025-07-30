import { create } from "zustand";
import { TimelineEvent } from "@/types/timeline";

type EventModalState = {
  isOpen: boolean;
  editingEvent:
    | (Omit<TimelineEvent, "startTime" | "endTime"> & {
        startTime: number;
        endTime: number;
      })
    | null;
  openModal: (
    event?: Omit<TimelineEvent, "startTime" | "endTime"> & {
      startTime: number;
      endTime: number;
    }
  ) => void;
  closeModal: () => void;
};

export const useEventModalStore = create<EventModalState>((set) => ({
  isOpen: false,
  editingEvent: null,
  openModal: (event) => set({ isOpen: true, editingEvent: event || null }),
  closeModal: () => set({ isOpen: false, editingEvent: null }),
}));
