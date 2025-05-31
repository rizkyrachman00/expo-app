import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { useBottomSheetDrawer } from "@/context/BottomSheetContext";

export const useProtectedRoute = () => {
  const { user, isLoaded } = useUser();
  const { openDrawer } = useBottomSheetDrawer();
  const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false);

  useEffect(() => {
    if (isLoaded && !user && !hasOpenedDrawer) {
      openDrawer();
      setHasOpenedDrawer(true);
    }
    
    if (user) {
      setHasOpenedDrawer(false);
    }
  }, [user, isLoaded, hasOpenedDrawer, openDrawer]);

  return { isAuthenticated: !!user, isLoaded };
};
