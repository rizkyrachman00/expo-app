import { Branch, MemberWithSubscriptions } from "@/schemas/subscription.schema";
import { create } from "zustand";

interface MemberState {
  members: MemberWithSubscriptions[];
  branches: Branch[];
  shouldRefetch: boolean;

  setMembers: (members: MemberWithSubscriptions[]) => void;
  setBranches: (branches: Branch[]) => void;
  setShouldRefetch: (val: boolean) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  branches: [],
  shouldRefetch: false,

  setMembers: (members) => set({ members }),
  setBranches: (branches) => set({ branches }),
  setShouldRefetch: (val) => set({ shouldRefetch: val }),
}));
