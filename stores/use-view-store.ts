import { create } from "zustand";

type ViewState = "timeline" | "spreadsheet";

interface ViewStore {
  view: ViewState;
  setView: (view: ViewState) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  view: "timeline",
  setView: (view) => set({ view }),
}));
