import {
  Calendar,
  MessageSquare,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  getDashboardStats,
  mockAppointments,
  mockMessages,
  mockTriageCases,
} from "../../data";
import { isToday } from "../../utils";
import StatCard from "./StatCard";
import UpcomingAppointments from "./UpcomingAppointments";
import RecentMessages from "./RecentMessages";
import TriageQueue from "./TriageQueue";

const Dashboard = () => {
  const stats = getDashboardStats();

  // Filter today's appointments
  const todaysAppointments = mockAppointments
    .filter((appointment) => isToday(appointment.date))
    .sort((a, b) => a.time.localeCompare(b.time));

  // Filter unread messages
  const unreadMessages = mockMessages
    .filter((message) => !message.read && message.recipientId === "u1")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Get active triage cases
  const activeTriageCases = mockTriageCases
    .filter(
      (triage) => triage.status === "waiting" || triage.status === "in-progress"
    )
    .sort((a, b) => {
      // Sort by priority first, then by arrival time
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    });

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
          title="Critical Patients"
          value={stats.criticalPatients}
          icon={<Users className="w-6 h-6 text-red-600" />}
          linkTo="/dashboard/patients"
          cardColor="bg-red-50 border-red-200"
          iconColor="text-red-600"
        />

        <StatCard
          title="Triage Cases"
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
        <TriageQueue triageCases={activeTriageCases} />
      </div>
    </div>
  );
};

export default Dashboard;
