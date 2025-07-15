import { create } from "zustand";

interface SearchSurveyStore {
  keyword: string;
  setKeyword: (kw: string) => void;
}

export const useSearchSurveyStore = create<SearchSurveyStore>((set) => ({
  keyword: "",
  setKeyword: (kw) => set({ keyword: kw }),
}));
