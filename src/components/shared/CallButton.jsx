import { CallInviteModal } from "./CallInviteModal";
import { VideoCall } from "./VideoCall";
import { useAuth } from "../../context";
import { useCallSignaling } from "../../hooks";

export function CallButton({ calleeId, children }) {
  const { user } = useAuth();
  const { incomingCall, activeCall, startCall, answerCall, endCall } =
    useCallSignaling(user?.id);

  return (
    <>
      {/* call button */}
      {!activeCall && <div onClick={() => startCall(calleeId)}>{children}</div>}

      {/* incoming call modal */}
      {incomingCall && (
        <CallInviteModal
          call={incomingCall}
          onAnswer={(accept) => answerCall(incomingCall.id, accept)}
        />
      )}

      {/* active video call */}
      {activeCall && (
        <VideoCall
          channelName={activeCall.channel_name}
          onLeave={() => endCall(activeCall.id)}
        />
      )}
    </>
  );
}
