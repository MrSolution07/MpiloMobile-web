// Dashboard.jsx
import { useState, useEffect } from "react";
import { Calendar, MessageSquare, AlertTriangle, Users } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { isToday } from "../../utils";
import StatCard from "./StatCard";
import UpcomingAppointments from "./UpcomingAppointments";
import RecentMessages from "./RecentMessages";
import TriageQueue from "./TriageQueue";

const Dashboard = () => {
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    pendingMessages: 0,
    criticalPatients: 0,
    triageCases: 0,
  });
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch critical patients (high priority AND waiting status)
        const { count: criticalPatientsCount } = await supabase
          .from("triage_cases")
          .select("*", { count: "exact", head: true })
          .eq("priority", "high")
          .eq("status", "waiting");

        // Fetch waiting triage cases count (for the stat card)
        const { count: waitingTriageCount } = await supabase
          .from("triage_cases")
          .select("*", { count: "exact", head: true })
          .eq("status", "waiting");

        // Fetch today's appointments
        const today = new Date().toISOString().split("T")[0];
        const { data: appointments } = await supabase
          .from("appointments")
          .select(
            `
            *,
            patient:patient_id (first_name, last_name)
          `
          )
          .eq("date", today)
          .order("time", { ascending: true });

        // Fetch unread messages
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("read", false)
          .eq("recipient_id", "u1") // Replace with current user ID
          .order("timestamp", { ascending: false });

        setStats({
          appointmentsToday: appointments?.length || 0,
          pendingMessages: messages?.length || 0,
          criticalPatients: criticalPatientsCount || 0,
          triageCases: waitingTriageCount || 0,
        });

        setTodaysAppointments(appointments || []);
        setUnreadMessages(messages || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up realtime subscriptions
    const appointmentsSubscription = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsSubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-gray-900 text-2xl">Dashboard</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Welcome back, Dr. Johnson. Here's what's happening today.
        </p>
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={stats.appointmentsToday}
          icon={<Calendar className="w-6 h-6 text-[#274D60]" />}
          trend="up"
          trendValue="20%"
          linkTo="/dashboard/appointments"
          // cardColor = bg-blue-50 border-blue-200"
          iconColor="text-[#274D60]"
        />

        <StatCard
          title="Unread Messages"
          value={stats.pendingMessages}
          icon={<MessageSquare className="w-6 h-6 text-[#274D60]" />}
          trend="down"
          trendValue="5%"
          linkTo="/dashboard/messages"
          // cardColor="bg-purple-50 border-purple-200"
          iconColor="text-[#274D60]"
        />

        <StatCard
          title="Critical Patients Waiting"
          value={stats.criticalPatients}
          icon={<Users className="w-6 h-6 text-[#274D60]" />}
          linkTo="/dashboard/triage"
          // cardColor="bg-red-50 border-red-200"
          iconColor="text-[#274D60]"
        />

        <StatCard
          title="Triage Cases Waiting"
          value={stats.triageCases}
          icon={<AlertTriangle className="w-6 h-6 text-[#274D60]" />}
          trend="up"
          trendValue="15%"
          linkTo="/dashboard/triage"
          // cardColor="bg-yellow-50 border-yellow-200"
          iconColor="text-[#274D60]"
        />
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <UpcomingAppointments appointments={todaysAppointments} />
        <RecentMessages messages={unreadMessages} />
        <TriageQueue />
      </div>
    </div>
  );
};

export default Dashboard;
