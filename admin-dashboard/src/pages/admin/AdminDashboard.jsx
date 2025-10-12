import { useState, useEffect } from "react";
import { Users, Calendar, FileText, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

// Card Components (unchanged)
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

      // Fetch total staff count (doctors)
      const { count: totalStaff } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Fetch current month appointments
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);
      
      const currentMonthEnd = new Date();
      currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
      currentMonthEnd.setDate(0);
      currentMonthEnd.setHours(23, 59, 59, 999);

      const { count: monthlyAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_datetime', currentMonthStart.toISOString())
        .lte('scheduled_datetime', currentMonthEnd.toISOString());

      // Fetch today's appointments with doctor names - FIXED QUERY
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_number,
          scheduled_datetime,
          appointment_type,
          status,
          patient_id,
          doctor_id,
          patients!appointments_patient_id_fkey(first_name, last_name),
          doctors!appointments_doctor_id_fkey(first_name, last_name, specialization)
        `)
        .gte('scheduled_datetime', todayStart.toISOString())
        .lte('scheduled_datetime', todayEnd.toISOString())
        .order('scheduled_datetime', { ascending: true });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      // Fetch recent activity from medical records
      const { data: activityData } = await supabase
        .from('medical_records')
        .select(`
          id,
          created_at,
          diagnosis,
          patients!medical_records_patient_id_fkey(first_name, last_name),
          doctors!medical_records_doctor_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch department workload based on appointments count per specialty
      const { data: workloadData } = await supabase
        .from('appointments')
        .select(`
          id,
          doctors!appointments_doctor_id_fkey(specialization)
        `)
        .gte('scheduled_datetime', currentMonthStart.toISOString())
        .lte('scheduled_datetime', currentMonthEnd.toISOString());

      // Process department workload
      if (workloadData) {
        const departmentStats = {};
        
        workloadData.forEach(appointment => {
          const specialty = appointment.doctors?.specialization || 'General';
          
          if (!departmentStats[specialty]) {
            departmentStats[specialty] = 0;
          }
          departmentStats[specialty]++;
        });

        // Get total appointments for percentage calculation
        const totalAppointments = workloadData.length;

        // Convert to array and calculate percentages
        const workloadArray = Object.entries(departmentStats).map(([department, count]) => {
          const percentage = totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0;
          return {
            department,
            patients: count,
            percentage: percentage,
            capacity: 100, // For progress bar
            utilization: percentage // For progress bar value
          };
        });

        setDepartmentWorkload(workloadArray);
      }

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
          title: "Appointments This Month",
          value: monthlyAppointments?.toLocaleString() || "0",
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
          patient: `${record.patients?.first_name || 'Unknown'} ${record.patients?.last_name || 'Patient'}`,
          action: record.diagnosis ? `Diagnosis: ${record.diagnosis}` : "Medical record updated",
          doctor: `${record.doctors?.first_name || 'Unknown'} ${record.doctors?.last_name || 'Doctor'}`,
          time: formatTimeAgo(record.created_at),
        }));
        setRecentActivity(processedActivity);
      }

      // Process upcoming appointments
      if (appointmentsData) {
        const processedAppointments = appointmentsData.map(appt => ({
          id: appt.id,
          appointmentNumber: appt.appointment_number,
          patient: `${appt.patients?.first_name || 'Unknown'} ${appt.patients?.last_name || 'Patient'}`,
          time: formatAppointmentTime(appt.scheduled_datetime),
          type: appt.appointment_type || "Consultation",
          doctor: `${appt.doctors?.first_name || 'Unknown'} ${appt.doctors?.last_name || 'Doctor'}`,
          specialty: appt.doctors?.specialization || "General",
          status: appt.status || "scheduled",
        }));
        setUpcomingAppointments(processedAppointments);
      }

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
                      {dept.patients} patients ({dept.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={dept.utilization}
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
              Today's Appointments ({upcomingAppointments.length})
            </CardTitle>
            <CardDescription>Today's scheduled appointments across all doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between items-center pb-3 last:border-0 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-gray-500 text-sm">
                        {appointment.time} - {appointment.type}
                      </p>
                      <p className="text-xs text-blue-600">{appointment.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Dr. {appointment.doctor}</p>
                      <p
                        className={`text-xs ${
                          appointment.status === "completed"
                            ? "text-green-600"
                            : appointment.status === "cancelled"
                            ? "text-red-600"
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
                      <span>Dr. {activity.doctor}</span>
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