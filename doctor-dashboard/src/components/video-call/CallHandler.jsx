import { useCall } from "@/context";
import { VideoCall } from "./VideoCall";
import { CallInviteModal } from "./CallInviteModal";

export const CallHandler = () => {
  const { incomingCall, activeCall, calling, endCall, answerCall } = useCall();

  // show active video call or caller waiting screen
  if (activeCall || calling) {
    return (
      <VideoCall
        // channelName={activeCall.channel_name}
        onLeave={() => endCall(activeCall.id)}
      />
    );
  }

  // if (calling) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-white text-xl">
  //       Calling...
  //     </div>
  //   );
  // }

  // show incoming call modal
  if (incomingCall) {
    return (
      <CallInviteModal
        call={incomingCall}
        onAnswer={(accept) => answerCall(incomingCall.id, accept)}
      />
    );
  }

  return null;
};
