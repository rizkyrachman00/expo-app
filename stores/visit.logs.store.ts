import { getVisitLogs } from "@/api/visit-logs";
import { formatDate, getToday } from "@/utils/dateHelpers";
import { create } from "zustand";

interface VisitLog {
  id: number;
  checkinAt: string;
  type: "member" | "guest";
  user: { id: number; name: string; phone: string; email?: string };
  branch: { id: number; name: string };
}

interface VisitLogState {
  logs: VisitLog[];
  loading: boolean;
  selectedDate: string;
  fetched: boolean;
  shouldRefetch: boolean;

  setSelectedDate: (date: string) => void;
  setShouldRefetch: (value: boolean) => void;
  fetchLogs: (token: string) => Promise<void>;
  filterByDate: (date: string) => VisitLog[];
}

export const useVisitLogStore = create<VisitLogState>((set, get) => ({
  logs: [],
  loading: false,
  selectedDate: formatDate(getToday()),
  fetched: false,
  shouldRefetch: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setShouldRefetch: (value) => set({ shouldRefetch: value }),

  fetchLogs: async (token: string) => {
    try {
      set({ loading: true });
      const logs = await getVisitLogs(token);
      if (Array.isArray(logs)) {
        set({ logs, fetched: true });
      }
    } catch (e) {
      console.error("Failed to fetch visit logs:", e);
    } finally {
      set({ loading: false, shouldRefetch: false });
    }
  },

  filterByDate: (date) =>
    get().logs.filter((log) => log.checkinAt.startsWith(date)),
}));
