import { Button } from "../ui";
import { useCall } from "@/context";

export function CallButton({ calleeId, children }) {
  const { startCall } = useCall();

  return (
    <Button
      onClick={() => startCall(calleeId)}
      className="hover:cursor-pointer border rounded-sm"
      variant="ghost"
      asChild
    >
      {children}
    </Button>
  );
}
