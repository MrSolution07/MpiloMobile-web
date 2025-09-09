import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

const VideoPlayer = ({ user, isLocal }) => {
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack && ref.current) user.videoTrack.play(ref.current);

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

export const VideoCall = ({ channelName = "testChannel", onLeave }) => {
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [localUid, setLocalUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clientRef = useRef(null);
  const localTracksRef = useRef({ audioTrack: null, videoTrack: null });
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const init = async () => {
      try {
        clientRef.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });
        const client = clientRef.current;

        // listen for remote streams
        client.on("user-published", async (remoteUser, mediaType) => {
          try {
            await client.subscribe(remoteUser, mediaType);

            if (mediaType === "video") {
              setUsers((prev) => {
                const existingIndex = prev.findIndex(
                  (u) => u.uid === remoteUser.uid
                );

                if (existingIndex >= 0) {
                  // update existing user
                  const updated = [...prev];

                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    videoTrack: remoteUser.videoTrack,
                  };

                  return updated;
                } else {
                  // add new user
                  return [
                    ...prev,
                    {
                      uid: remoteUser.uid,
                      audioTrack: remoteUser.audioTrack || null,
                      videoTrack: remoteUser.videoTrack || null,
                    },
                  ];
                }
              });
            }

            if (mediaType === "audio") {
              setUsers((prev) => {
                const existingIndex = prev.findIndex(
                  (u) => u.uid === remoteUser.uid
                );
                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    audioTrack: remoteUser.audioTrack,
                  };
                  return updated;
                } else {
                  return [
                    ...prev,
                    {
                      uid: remoteUser.uid,
                      audioTrack: remoteUser.audioTrack || null,
                      videoTrack: remoteUser.videoTrack || null,
                    },
                  ];
                }
              });

              if (remoteUser.audioTrack) remoteUser.audioTrack.play();
            }
          } catch (error) {
            console.error("Error subscribing to remote user:", error);
          }
        });

        client.on("user-unpublished", (remoteUser, mediaType) => {
          setUsers((prev) => {
            const updated = prev.map((user) => {
              if (user.uid === remoteUser.uid) {
                if (mediaType === "video") {
                  return { ...user, videoTrack: null };
                }
                if (mediaType === "audio") {
                  return { ...user, audioTrack: null };
                }
              }
              return user;
            });
            return updated;
          });
        });

        client.on("user-left", (remoteUser) => {
          setUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
        });

        // join the channel
        const uid = await client.join(APP_ID, channelName, null, null);
        setLocalUid(uid);

        // create local tracks
        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { audioTrack, videoTrack };

        // add local user to users array
        setUsers((prev) => [
          ...prev.filter((u) => u.uid !== uid), // remove if exists
          { uid, audioTrack, videoTrack },
        ]);

        // publish local tracks
        await client.publish([audioTrack, videoTrack]);
        setJoined(true);
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize video call:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    init();

    // cleanup function
    return () => {
      const cleanup = async () => {
        try {
          const client = clientRef.current;
          const { audioTrack, videoTrack } = localTracksRef.current;

          // stop and close local tracks
          if (audioTrack) {
            audioTrack.stop();
            audioTrack.close();
          }

          if (videoTrack) {
            videoTrack.stop();
            videoTrack.close();
          }

          // leave channel and reset client
          if (client) {
            await client.leave();
            clientRef.current = null;
          }

          onLeave?.();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      };
      cleanup();
    };
  }, []);

  const localUser = users.find((u) => u.uid === localUid);
  const remoteUsers = users.filter((u) => u.uid !== localUid);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-red-900 text-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">Video Call Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        {/* Remote user (full screen) */}
        {remoteUsers.length > 0 ? (
          <VideoPlayer user={remoteUsers[0]} isLocal={false} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            {loading ? "Connecting..." : "Waiting for remote user..."}
          </div>
        )}

        {/* Local user (small overlay) */}
        {localUser && (
          <div className="absolute bottom-4 right-4">
            <VideoPlayer user={localUser} isLocal={true} />
          </div>
        )}

        {/* Status indicators */}
        {loading && (
          <p className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            Joining call...
          </p>
        )}

        {joined && (
          <p className="absolute top-4 left-4 text-white bg-green-600 bg-opacity-75 px-3 py-1 rounded text-sm">
            Connected • {users.length} user{users.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};
