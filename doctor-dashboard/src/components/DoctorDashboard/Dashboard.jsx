// Dashboard.jsx
import { useState, useEffect } from "react";
import {
  Calendar,
  MessageSquare,
  AlertTriangle,
  Users,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthProvider";
import { useDoctorAppointments } from "../../hooks/useDoctorAppointments";
import StatCard from "./StatCard";
import UpcomingAppointments from "./UpcomingAppointments";
import RecentMessages from "./RecentMessages";
import TriageQueue from "./TriageQueue";

const Dashboard = () => {
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useDoctorAppointments();
  
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    pendingMessages: 0,
    criticalPatients: 0,
    triageCases: 0
  });
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');

  // Calculate today's appointments from the hook
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayApps = appointments.filter(app => app.date === today);
      
      setTodaysAppointments(todayApps);
      setStats(prev => ({
        ...prev,
        appointmentsToday: todayApps.length
      }));
    }
  }, [appointments]);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (user?.email) {
        try {
          const { data: doctorData, error } = await supabase
            .from('doctors')
            .select('first_name, last_name')
            .eq('email', user.email)
            .single();

          if (doctorData && !error) {
            setDoctorName(`Dr ${doctorData.first_name} ${doctorData.last_name}`);
          } else {
            // Fallback to user metadata or email
            const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
            setDoctorName(`Dr ${fallbackName}`);
          }
        } catch (error) {
          console.error('Error fetching doctor name:', error);
          // Fallback to user metadata or email
          const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
          setDoctorName(`Dr ${fallbackName}`);
        }
      }
    };

    fetchDoctorName();
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch critical patients (high priority AND waiting status)
        const { count: criticalPatientsCount } = await supabase
          .from('triage_cases')
          .select('*', { count: 'exact', head: true })
          .eq('priority', 'high')
          .eq('status', 'waiting');
        
        // Fetch waiting triage cases count (for the stat card)
        const { count: waitingTriageCount } = await supabase
          .from('triage_cases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting');
        
        // Fetch unread messages
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('read', false)
          .eq('recipient_id', user?.id) // Use current user ID
          .order('timestamp', { ascending: false });
        
        setStats(prev => ({
          ...prev,
          pendingMessages: messages?.length || 0,
          criticalPatients: criticalPatientsCount || 0,
          triageCases: waitingTriageCount || 0
        }));
        
        setUnreadMessages(messages || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }

    // Set up realtime subscriptions
    const appointmentsSubscription = supabase
      .channel('appointments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, () => {
        // The useDoctorAppointments hook will handle real-time updates
      })
      .subscribe();

    const triageSubscription = supabase
      .channel('triage-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'triage_cases'
      }, () => {
        // Refresh triage data
        if (user?.id) {
          fetchDashboardData();
        }
      })
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        // Refresh messages data
        if (user?.id) {
          fetchDashboardData();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsSubscription);
      supabase.removeChannel(triageSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, [user?.id]);

  const isLoading = loading || appointmentsLoading;

  if (isLoading) {
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
          Welcome back, {doctorName || 'Dr. User'}. Here's what's happening today.
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
          // cardColor="bg-blue-50 border-blue-200"
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