import { useBottomSheetDrawer } from "@/context/BottomSheetContext";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export const useProtectedRoute = () => {
  const { user, isLoaded } = useUser();
  const { openDrawer, closeDrawer } = useBottomSheetDrawer();
  const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user && !hasOpenedDrawer) {
      openDrawer();
      setHasOpenedDrawer(true);
    }

    if (user && hasOpenedDrawer) {
      closeDrawer();
      setHasOpenedDrawer(false);
    }
  }, [user, isLoaded, hasOpenedDrawer, openDrawer, closeDrawer]);

  return { isAuthenticated: !!user, isLoaded };
};
