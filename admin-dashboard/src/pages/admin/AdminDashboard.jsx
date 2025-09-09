import { useState, useEffect } from "react";
import { Users, Calendar, FileText, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

// Card Components
const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const Progress = ({ value = 0, className = "", indicatorClassName = "" }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className={`h-full w-full flex-1 bg-red-600 transition-all ${indicatorClassName}`}
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [departmentWorkload, setDepartmentWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total patients count
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch medical records count
      const { count: totalMedicalRecords } = await supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true });

      // Fetch total staff count
      const { count: totalStaff } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Fetch monthly appointments average
      const { count: monthlyAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      // Fetch recent activity from medical records
      const { data: activityData } = await supabase
        .from('medical_records')
        .select(`
          id,
          created_at,
          diagnosis,
          patient:patients(first_name, last_name),
          doctor:doctors(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch today's upcoming appointments
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_time,
          type,
          status,
          patient:patients(first_name, last_name),
          doctor:doctors(name)
        `)
        .gte('appointment_date', todayStart.toISOString())
        .lte('appointment_date', todayEnd.toISOString())
        .order('appointment_time', { ascending: true })
        .limit(3);

      // Process the stats data
      setStats([
        {
          title: "Total Patients",
          value: totalPatients?.toLocaleString() || "0",
          icon: Users,
          change: "+0.8%",
          trend: "up",
        },
        {
          title: "Appointments (Monthly Avg)",
          value: Math.round(monthlyAppointments/1)?.toLocaleString() || "0",
          icon: Calendar,
          change: "+2.1%",
          trend: "up",
        },
        {
          title: "Medical Records",
          value: totalMedicalRecords?.toLocaleString() || "0",
          icon: FileText,
          change: "+1.5%",
          trend: "up",
        },
        {
          title: "Total Staff",
          value: totalStaff?.toLocaleString() || "0",
          icon: Users,
          change: "-0.2%",
          trend: "down",
        },
      ]);

      // Process recent activity
      if (activityData) {
        const processedActivity = activityData.map(record => ({
          id: record.id,
          patient: `${record.patient?.first_name || 'Unknown'} ${record.patient?.last_name || 'Patient'}`,
          action: record.diagnosis ? `Diagnosis: ${record.diagnosis}` : "Medical record updated",
          doctor: record.doctor?.name || "Unknown Doctor",
          time: formatTimeAgo(record.created_at),
        }));
        setRecentActivity(processedActivity);
      }

      // Process upcoming appointments
      if (appointmentsData) {
        const processedAppointments = appointmentsData.map(appt => ({
          id: appt.id,
          patient: `${appt.patient?.first_name || 'Unknown'} ${appt.patient?.last_name || 'Patient'}`,
          time: formatAppointmentTime(appt.appointment_time),
          type: appt.type || "Consultation",
          doctor: appt.doctor?.name || "Unknown Doctor",
          status: appt.status || "Pending",
        }));
        setUpcomingAppointments(processedAppointments);
      }

      // Set all department workloads to 0%
      setDepartmentWorkload([
        { department: "Cardiology", patients: 0, capacity: 100 },
        { department: "Neurology", patients: 0, capacity: 100 },
        { department: "Pediatrics", patients: 0, capacity: 100 },
        { department: "Orthopedics", patients: 0, capacity: 100 },
      ]);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return "just now";
  };

  // Helper function to format appointment time
  const formatAppointmentTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .card-hover {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <h1 className="mb-6 font-bold text-3xl text-black">Dashboard</h1>

      {/* Stats Section */}
      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6 ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="mt-1 font-bold text-2xl">{stat.value}</h3>
                </div>
                <div className="bg-[#274D60]/10 p-2 rounded-full text-[#274D60]">
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-center mt-3 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUp className="mr-1 w-3 h-3 text-green-600" />
                ) : (
                  <ArrowDown className="mr-1 w-3 h-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1 text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="gap-6 grid lg:grid-cols-2 mt-6">
        {/* Department Workload */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 w-5 h-5" />
              Department Workload
            </CardTitle>
            <CardDescription>Current patient distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentWorkload.map((dept, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{dept.department}</span>
                    <span className="text-gray-500 text-sm">
                      {dept.patients}/{dept.capacity} patients (0%)
                    </span>
                  </div>
                  <Progress
                    value={0}
                    className="h-2 bg-gray-200"
                    indicatorClassName="bg-red-600"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 w-5 h-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Today's scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center pb-3 last:border-0 border-b">
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-gray-500 text-sm">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{appointment.doctor}</p>
                      <p
                        className={`text-xs ${
                          appointment.status === "Confirmed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {appointment.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 card-hover">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your medical facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center pb-3 last:border-0 border-b">
                  <div className="bg-red-600 mr-4 rounded-full w-2 h-2" />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.patient}</span> - {activity.action}
                    </p>
                    <div className="flex mt-1 text-gray-500 text-xs">
                      <span>{activity.doctor}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;