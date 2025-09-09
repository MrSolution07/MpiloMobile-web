import { useEffect, useState } from "react";
import { supabase } from "../services";

export function useCallSignaling(myUserId) {
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // listen for incoming calls
  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase
      .channel("incoming_calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
          filter: `callee_id=eq.${myUserId}`,
        },
        (payload) => {
          const call = payload.new;
          if (call.status === "ringing") setIncomingCall(call);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [myUserId]);

  // listen for call status updates (for caller)
  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase
      .channel("call_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "calls",
          filter: `caller_id=eq.${myUserId}`,
        },
        (payload) => {
          const call = payload.new;
          if (call.status === "accepted") setActiveCall(call);
          if (["declined", "ended"].includes(call.status)) {
            setActiveCall(null);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [myUserId]);

  async function startCall(calleeId) {
    const channelName = `call_${crypto.randomUUID()}`;
    const { error } = await supabase.from("calls").insert([
      {
        caller_id: myUserId,
        callee_id: calleeId,
        channel_name: channelName,
        status: "ringing",
      },
    ]);
    if (error) console.error(error);
  }

  async function answerCall(callId, accept) {
    await supabase
      .from("calls")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", callId);

    if (accept) {
      const { data } = await supabase
        .from("calls")
        .select()
        .eq("id", callId)
        .single();
      setActiveCall(data);
    } else {
      setIncomingCall(null);
    }
  }

  async function endCall(callId) {
    await supabase.from("calls").update({ status: "ended" }).eq("id", callId);
    setActiveCall(null);
  }

  return { incomingCall, activeCall, startCall, answerCall, endCall };
}
