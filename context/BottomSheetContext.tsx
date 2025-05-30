import React, { createContext, useContext } from "react";

interface BottomSheetContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useBottomSheetDrawer() {
  return useContext(BottomSheetContext);
}

export default BottomSheetContext;
