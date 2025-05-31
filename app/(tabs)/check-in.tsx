// app/(tabs)/check-in.tsx
import ProtectedScreen from "@/components/auth/ProtectedScreen";
import CheckInScreen from "@/screens/check-in/check.in.screen";

export default function CheckIn() {
  return (
    <ProtectedScreen>
      <CheckInScreen />
    </ProtectedScreen>
  );
}
