import { useCall } from "@/context";
import { VideoCall } from "./VideoCall";
import { CallInviteModal } from "./CallInviteModal";

export const CallHandler = () => {
  const { incomingCall, activeCall, calling, endCall, answerCall } = useCall();

  console.log('🎯 CallHandler state:', { activeCall: !!activeCall, calling, incomingCall: !!incomingCall });

  // show active video call ONLY if we have an active call
  if (activeCall) {
    console.log('📹 Rendering VideoCall with channel:', activeCall.channel_name);
    return (
      <VideoCall
        channelName={activeCall.channel_name}
        onLeave={() => endCall(activeCall.id)}
      />
    );
  }

  // show "Calling..." screen while waiting for other person to answer
  if (calling) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
          </div>
          <p className="text-white text-xl font-semibold">Calling...</p>
          <p className="text-gray-300 text-sm mt-2">Waiting for response</p>
        </div>
      </div>
    );
  }

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
