import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const CHANNEL = "testChannel";
const TEMP_TOKEN = import.meta.env.VITE_AGORA_TEMP_TOKEN; // For dev only

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoPlayer = ({ user, isLocal }) => {
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack) user.videoTrack.play(ref.current);

    return () => {
      if (user.videoTrack) user.videoTrack.stop();
    };
  }, [user.videoTrack]);

  return (
    <div
      ref={ref}
      className={`bg-black rounded-lg shadow-md ${
        isLocal ? "w-40 h-28 border-2 border-white" : "w-full h-full"
      }`}
    ></div>
  );
};

export const VideoCall = ({ channelName, onLeave }) => {
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [localUid, setLocalUid] = useState(null);

  useEffect(() => {
    // if (!channelName) return;

    const init = async () => {
      // const uid = await client.join(APP_ID, channelName, TEMP_TOKEN, null);
      const uid = await client.join(APP_ID, CHANNEL, TEMP_TOKEN, null);
      setLocalUid(uid);

      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();

      setUsers((prev) => [...prev, { uid, audioTrack, videoTrack }]);

      await client.publish([audioTrack, videoTrack]);
      setJoined(true);
    };

    init();

    // Listen for remote streams
    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);

      if (mediaType === "video") {
        setUsers((prev) => {
          const exists = prev.find((u) => u.uid === remoteUser.uid);
          if (exists) return prev;

          return [
            ...prev,
            {
              uid: remoteUser.uid,
              audioTrack: remoteUser.audioTrack || null,
              videoTrack: remoteUser.videoTrack || null,
            },
          ];
        });
      }

      if (mediaType === "audio" && remoteUser.audioTrack) {
        remoteUser.audioTrack.play();
      }
    });

    client.on("user-left", async (remoteUser) => {
      setUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
    });

    return () => {
      client.leave();
      onLeave?.();
    };
  }, [channelName]);

  const localUser = users.find((u) => u.uid === localUid);
  const remoteUsers = users.filter((u) => u.uid !== localUid);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        {/* Remote user (full screen) */}
        {remoteUsers.length > 0 ? (
          <VideoPlayer user={remoteUsers[0]} isLocal={false} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Waiting for remote user...
          </div>
        )}

        {/* Local user (small overlay) */}
        {localUser && (
          <div className="absolute bottom-4 right-4">
            <VideoPlayer user={localUser} isLocal={true} />
          </div>
        )}

        {!joined && (
          <p className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            Joining call...
          </p>
        )}
      </div>
    </div>
  );
};
