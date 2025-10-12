import * as React from "react";
import { supabase } from "@/services";
import { useAuth } from "./AuthProvider";

const CallProviderContext = React.createContext(undefined);

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const myUserId = user?.id;

  console.log("CallProvider:", myUserId);

  const [calling, setCalling] = React.useState(false);
  const [activeCall, setActiveCall] = React.useState(null);
  const [incomingCall, setIncomingCall] = React.useState(null);

  // listen for incoming calls
  React.useEffect(() => {
    if (!myUserId) return;

    console.log('👂 Setting up incoming calls listener for user:', myUserId);

    const channel = supabase
      .channel(`incoming_calls_${myUserId}`)
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

          if (call.status === "ringing") {
            console.log("📞 Incoming call payload for user", myUserId, payload);
            setIncomingCall(call);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔔 Incoming calls subscription status:', status);
      });

    return () => supabase.removeChannel(channel);
  }, [myUserId]);

  // listen for call status updates (for caller)
  React.useEffect(() => {
    if (!myUserId) return;

    console.log('👂 Setting up call updates listener for user:', myUserId);

    const channel = supabase
      .channel(`call_updates_${myUserId}`)
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
          console.log('📞 Call status updated. Status:', call.status, 'Full call:', call);

          if (call.status === "accepted") {
            console.log('✅ Call accepted! Setting activeCall');
            setActiveCall(call);
            setCalling(false);
          } else if (["declined", "ended"].includes(call.status)) {
            console.log('❌ Call ended or declined. Status was:', call.status);
            setActiveCall(null);
            setCalling(false);
          } else {
            console.log('⚠️ Unknown call status:', call.status);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔔 Call updates subscription status:', status);
      });

    return () => {
      console.log('🔌 Removing call updates channel');
      supabase.removeChannel(channel);
    };
  }, [myUserId]);

  const startCall = async (calleeId) => {
    const channelName = `call_${crypto.randomUUID()}`;
    console.log('📱 Starting call:', { caller: myUserId, callee: calleeId, channel: channelName });
    
    const { error } = await supabase.from("calls").insert([
      {
        caller_id: myUserId,
        callee_id: calleeId,
        channel_name: channelName,
        status: "ringing",
      },
    ]);

    if (error) {
      console.error('❌ Error starting call:', error);
    } else {
      console.log('✅ Call created, setting calling state to true');
      setCalling(true);
    }
  };

  const answerCall = async (callId, accept) => {
    console.log('📞 Answering call:', { callId, accept });
    
    await supabase
      .from("calls")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", callId);

    setIncomingCall(null);

    if (accept) {
      const { data } = await supabase
        .from("calls")
        .select()
        .eq("id", callId)
        .single();
      console.log('✅ Call accepted, setting activeCall:', data);
      setActiveCall(data);
    }
  };

  const endCall = async (callId) => {
    await supabase.from("calls").update({ status: "ended" }).eq("id", callId);
    setActiveCall(null);
    setCalling(false);
  };

  const value = {
    incomingCall,
    activeCall,
    calling,
    startCall,
    answerCall,
    endCall,
  };

  return (
    <CallProviderContext.Provider value={value}>
      {children}
    </CallProviderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCall = () => {
  const context = React.useContext(CallProviderContext);

  if (context === undefined)
    throw new Error("useCall must be used within a CallProvider");

  return context;
};
