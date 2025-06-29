import { Branch, MemberWithSubscriptions } from "@/schemas/subscription.schema";
import { create } from "zustand";

// Zustand state
interface MemberState {
  members: MemberWithSubscriptions[];
  branches: Branch[];
  shouldRefetch: boolean;

  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;

  setMembers: (members: MemberWithSubscriptions[]) => void;
  setBranches: (branches: Branch[]) => void;
  setShouldRefetch: (val: boolean) => void;
}

// Zustand store
export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  branches: [],
  shouldRefetch: false,

  selectedBranchId: null, // default: tidak ada filter cabang
  setSelectedBranchId: (id) => set({ selectedBranchId: id }), // setter

  setMembers: (members) => set({ members }),
  setBranches: (branches) => set({ branches }),
  setShouldRefetch: (val) => set({ shouldRefetch: val }),
}));
