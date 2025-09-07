import { Calendar, MessageSquare, AlertTriangle, Users } from "lucide-react";
import {
  getDashboardStats,
  mockAppointments as fetchAppointments,
  mockMessages as fetchMessages,
  mockTriageCases as fetchTriageCases,
} from "../../data";
import { isToday } from "../../utils";
import StatCard from "./StatCard";
import UpcomingAppointments from "./UpcomingAppointments";
import RecentMessages from "./RecentMessages";
import TriageQueue from "./TriageQueue";
import { useAuth } from "../../context";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    appointmentsToday: 0,
    pendingMessages: 0,
    criticalPatients: 0,
    triageCases: 0,
  });
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [activeTriageCases, setActiveTriageCases] = useState([]);
  const userId = user?.id || "u1";

  useEffect(() => {
    async function loadData() {
      // fetch stats
      const dashboardStats = await getDashboardStats(userId);
      setStats(dashboardStats);

      // fetch appointments
      const appointments = await fetchAppointments();
      setTodaysAppointments(
        appointments
          .filter((appointment) => isToday(new Date(appointment.date)))
          .sort((a, b) => a.time.localeCompare(b.time))
      );

      // fetch messages
      const messages = await fetchMessages(userId);
      setUnreadMessages(
        messages
          .filter((message) => !message.read && message.recipient_id === userId)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );

      // fetch triage cases
      const triageCases = await fetchTriageCases();
      setActiveTriageCases(
        triageCases
          .filter(
            (triage) =>
              triage.status === "waiting" || triage.status === "in-progress"
          )
          .sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (a.priority !== b.priority) {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(a.arrival_time) - new Date(b.arrival_time);
          })
      );
    }

    loadData();
  }, [userId]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-gray-900 text-2xl">Dashboard</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Welcome back, {user?.email}. Here's what's happening today.
        </p>
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={stats.appointmentsToday}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          trend="up"
          trendValue="20%"
          linkTo="/dashboard/appointments"
          cardColor="bg-blue-50 border-blue-200"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Unread Messages"
          value={stats.pendingMessages}
          icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
          trend="down"
          trendValue="5%"
          linkTo="/dashboard/messages"
          cardColor="bg-purple-50 border-purple-200"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Critical Patients Waiting"
          value={stats.criticalPatients}
          icon={<Users className="w-6 h-6 text-red-600" />}
          linkTo="/dashboard/triage"
          cardColor="bg-red-50 border-red-200"
          iconColor="text-red-600"
        />

        <StatCard
          title="Triage Cases Waiting"
          value={stats.triageCases}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          trend="up"
          trendValue="15%"
          linkTo="/dashboard/triage"
          cardColor="bg-yellow-50 border-yellow-200"
          iconColor="text-yellow-600"
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