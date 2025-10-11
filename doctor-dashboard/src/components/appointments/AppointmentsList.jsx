// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Calendar, Filter, Search, Plus, RefreshCw } from "lucide-react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   Button,
//   Badge,
//   Avatar,
// } from "../ui";
// import {
//   formatDate,
//   formatTime,
//   getRelativeDateLabel,
//   groupAppointmentsByDate,
//   isToday,
// } from "../../utils";
// import { useDoctorAppointments } from "../../hooks/useDoctorAppointments";

// function AppointmentsList() {
//   const [view, setView] = useState("list"); 
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");

//   const {
//     appointments: doctorAppointments,
//     filteredAppointments,
//     loading,
//     error,
//     refresh
//   } = useDoctorAppointments();

//   // Get filtered appointments based on current filters
//   const filteredAppointmentsList = filteredAppointments({
//     searchQuery,
//     statusFilter,
//     typeFilter
//   });

//   const appointmentTypes = [
//     "all",
//     ...new Set(doctorAppointments.map((app) => app.type)),
//   ];

//   // Separate cancelled appointments
//   const cancelledAppointments = filteredAppointmentsList.filter(
//     app => app.status === "cancelled"
//   );

//   // Filter out cancelled appointments from the main list
//   const activeAppointments = filteredAppointmentsList.filter(
//     app => app.status !== "cancelled"
//   );

//   // Group active appointments by date
//   const groupedAppointments = groupAppointmentsByDate(activeAppointments);

//   // Sort dates with today first, then future dates, then past dates
//   const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
//     if (isToday(a)) return -1;
//     if (isToday(b)) return 1;
    
//     const dateA = new Date(a);
//     const dateB = new Date(b);
    
//     // Future dates before past dates
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const isAFuture = dateA >= today;
//     const isBFuture = dateB >= today;
    
//     if (isAFuture && !isBFuture) return -1;
//     if (!isAFuture && isBFuture) return 1;
    
//     // Sort future dates ascending, past dates descending
//     if (isAFuture && isBFuture) {
//       return dateA - dateB;
//     } else {
//       return dateB - dateA;
//     }
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
//         <div className="text-red-600 mb-2">⚠️</div>
//         <h3 className="mt-2 font-medium text-gray-900 text-lg">Error</h3>
//         <p className="mt-1 text-gray-500 text-sm">{error}</p>
//         <Button
//           variant="primary"
//           size="sm"
//           onClick={refresh}
//           className="mt-4"
//           icon={<RefreshCw className="w-4 h-4" />}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
//         <div>
//           <h1 className="font-bold text-gray-900 text-2xl">My Appointments</h1>
//           <p className="mt-1 text-gray-500 text-sm">
//             Manage and view all your patient appointments
//           </p>
//         </div>

//         <div className="flex space-x-2">
//           <Button
//             variant="secondary"
//             size="sm"
//             icon={<Filter className="w-4 h-4" />}
//             onClick={() => setFilterOpen(!filterOpen)}
//             className="mr-2"
//           >
//             Filter
//           </Button>
//           <Button
//             variant="secondary"
//             size="sm"
//             icon={<RefreshCw className="w-4 h-4" />}
//             onClick={refresh}
//             className="mr-2"
//           >
//             Refresh
//           </Button>
//           <div className="flex border border-gray-200 rounded-md overflow-hidden ml-2">
//             <button
//               className={`px-3 py-1.5 text-sm font-medium ${view === "list"
//                   ? "bg-red-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//                 }`}
//               onClick={() => setView("list")}
//             >
//               List
//             </button>
//             <button
//               className={`px-3 py-1.5 text-sm font-medium ${view === "calendar"
//                   ? "bg-red-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//                 }`}
//               onClick={() => setView("calendar")}
//             >
//               Calendar
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-4">
//         <div className="relative">
//           <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
//             <Search className="w-5 h-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search appointments..."
//             className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {filterOpen && (
//           <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 text-sm">
//                 Status
//               </label>
//               <select
//                 className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="scheduled">Scheduled</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="no_show">No Show</option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 font-medium text-gray-700 text-sm">
//                 Type
//               </label>
//               <select
//                 className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//               >
//                 {appointmentTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {view === "list" && (
//         <div className="space-y-6">
//           {/* Active Appointments */}
//           {sortedDates.length > 0 ? (
//             sortedDates.map((date) => (
//               <Card key={date}>
//                 <CardHeader className="bg-gray-50 border-gray-100 border-b">
//                   <CardTitle className="font-medium text-gray-900 text-lg">
//                     {isToday(date)}
//                     {getRelativeDateLabel(date)} - {formatDate(date)}
//                     {isToday(date) && (
//                       <span className="ml-2 text-sm font-normal text-red-600">
//                         {/* (Today) */}
//                       </span>
//                     )}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="divide-y divide-gray-100">
//                   {groupedAppointments[date]
//                     .sort((a, b) => a.time.localeCompare(b.time))
//                     .map((appointment) => {
//                       const patient = appointment.patient;
//                       return (
//                         <div
//                           key={appointment.id}
//                           className="flex items-center hover:bg-gray-50 -mx-2 px-2 py-4 first:pt-2 last:pb-2 rounded-md transition-colors"
//                         >
//                           <div className="flex-shrink-0 mr-4">
//                             <div className="flex flex-col justify-center items-center w-16 text-center">
//                               <span className="font-semibold text-gray-900 text-sm">
//                                 {formatTime(appointment.time)}
//                               </span>
//                               <span className="mt-1 text-gray-500 text-xs">
//                                 {appointment.duration} min
//                               </span>
//                             </div>
//                           </div>

//                           <div className="flex-shrink-0 mr-4">
//                             <Avatar
//                               src={patient?.avatar}
//                               alt={appointment.patientName}
//                               size="md"
//                               status={
//                                 patient?.status === "critical"
//                                   ? "busy"
//                                   : patient?.status === "moderate"
//                                     ? "away"
//                                     : "online"
//                               }
//                             />
//                           </div>

//                           <div className="flex-grow min-w-0">
//                             <p className="font-medium text-gray-900 text-sm">
//                               {appointment.patientName}
//                             </p>
//                             <div className="flex items-center mt-1">
//                               <Badge
//                                 text={appointment.type}
//                                 variant="primary"
//                                 size="small"
//                               />
//                               {patient?.status === "critical" && (
//                                 <Badge
//                                   text="Critical"
//                                   variant="danger"
//                                   size="small"
//                                   className="ml-2"
//                                 />
//                               )}
//                             </div>
//                             {appointment.notes && (
//                               <p className="mt-1 text-gray-500 text-xs line-clamp-1">
//                                 {appointment.notes}
//                               </p>
//                             )}
//                           </div>

//                           <div className="flex-shrink-0 ml-4">
//                             <Badge
//                               text={appointment.status}
//                               variant={
//                                 appointment.status === "scheduled"
//                                   ? "primary"
//                                   : appointment.status === "completed"
//                                     ? "success"
//                                     : appointment.status === "cancelled"
//                                       ? "danger"
//                                       : "warning"
//                               }
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
//               <Calendar className="mx-auto w-12 h-12 text-gray-300" />
//               <h3 className="mt-2 font-medium text-gray-900 text-lg">
//                 No appointments found
//               </h3>
//               <p className="mt-1 text-gray-500 text-sm">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           )}

//           {/* Cancelled Appointments Section */}
//           {cancelledAppointments.length > 0 && statusFilter === "all" && (
//             <Card className="border-dashed border-2 border-gray-300">
//               <CardHeader className="bg-gray-100 border-gray-200 border-b">
//                 <CardTitle className="font-medium text-gray-600 text-lg">
//                   📋 Cancelled Appointments ({cancelledAppointments.length})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="divide-y divide-gray-100">
//                 {cancelledAppointments.map((appointment) => {
//                   const patient = appointment.patient;
//                   return (
//                     <div
//                       key={appointment.id}
//                       className="flex items-center hover:bg-gray-50 -mx-2 px-2 py-4 first:pt-2 last:pb-2 rounded-md transition-colors opacity-70"
//                     >
//                       <div className="flex-shrink-0 mr-4">
//                         <div className="flex flex-col justify-center items-center w-16 text-center">
//                           <span className="font-semibold text-gray-500 text-sm">
//                             {formatTime(appointment.time)}
//                           </span>
//                           <span className="mt-1 text-gray-400 text-xs">
//                             {appointment.duration} min
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex-shrink-0 mr-4">
//                         <Avatar
//                           src={patient?.avatar}
//                           alt={appointment.patientName}
//                           size="md"
//                           status="offline"
//                         />
//                       </div>

//                       <div className="flex-grow min-w-0">
//                         <p className="font-medium text-gray-500 text-sm">
//                           {appointment.patientName}
//                         </p>
//                         <div className="flex items-center mt-1">
//                           <Badge
//                             text={appointment.type}
//                             variant="secondary"
//                             size="small"
//                           />
//                         </div>
//                         {appointment.notes && (
//                           <p className="mt-1 text-gray-400 text-xs line-clamp-1">
//                             {appointment.notes}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex-shrink-0 ml-4">
//                         <Badge
//                           text="Cancelled"
//                           variant="danger"
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {view === "calendar" && (
//         <Card>
//           <CardContent className="p-6">
//             <div className="py-10 text-center">
//               <Calendar className="mx-auto w-12 h-12 text-gray-400" />
//               <h3 className="mt-2 font-medium text-gray-900 text-lg">
//                 Calendar View
//               </h3>
//               <p className="mt-1 text-gray-500 text-sm">
//                 Calendar view would be implemented here with a full monthly
//                 calendar
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// export default AppointmentsList;










import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, Search, Plus, RefreshCw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Avatar,
} from "../ui";
import {
  formatDate,
  formatTime,
  getRelativeDateLabel,
  groupAppointmentsByDate,
  isToday,
} from "../../utils";
import { useDoctorAppointments } from "../../hooks/useDoctorAppointments";

function AppointmentsList() {
  const [view, setView] = useState("list"); 
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const {
    appointments: doctorAppointments,
    filteredAppointments,
    loading,
    error,
    refresh
  } = useDoctorAppointments();

  // Get filtered appointments based on current filters
  const filteredAppointmentsList = filteredAppointments({
    searchQuery,
    statusFilter,
    typeFilter,
    dateFilter
  });

  const appointmentTypes = [
    "all",
    ...new Set(doctorAppointments.map((app) => app.type)),
  ];

  // Group appointments by date for both active and cancelled
  const groupedAppointments = groupAppointmentsByDate(filteredAppointmentsList);

  // Sort dates with today first, then future dates, then past dates
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
    if (isToday(a)) return -1;
    if (isToday(b)) return 1;
    
    const dateA = new Date(a);
    const dateB = new Date(b);
    
    // Future dates before past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isAFuture = dateA >= today;
    const isBFuture = dateB >= today;
    
    if (isAFuture && !isBFuture) return -1;
    if (!isAFuture && isBFuture) return 1;
    
    // Sort future dates ascending, past dates descending
    if (isAFuture && isBFuture) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  // Calendar view component
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Create calendar days array
    const calendarDays = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = groupedAppointments[dateStr] || [];
      calendarDays.push({
        day,
        date: dateStr,
        appointments: dayAppointments
      });
    }
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-gray-900 text-lg">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium text-gray-700 text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayData, index) => {
              if (!dayData) {
                return <div key={`empty-${index}`} className="h-24 border border-gray-100" />;
              }
              
              const isCurrentDay = dayData.day === today.getDate() && currentMonth === today.getMonth();
              const hasAppointments = dayData.appointments.length > 0;
              
              return (
                <div
                  key={dayData.date}
                  className={`h-24 border p-1 ${
                    isCurrentDay 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200'
                  } ${hasAppointments ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${
                      isCurrentDay ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {dayData.day}
                    </span>
                    {hasAppointments && (
                      <span className="bg-red-100 text-red-800 text-xs px-1 rounded">
                        {dayData.appointments.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
                    {dayData.appointments.slice(0, 2).map(app => (
                      <div
                        key={app.id}
                        className={`text-xs p-1 rounded truncate ${
                          app.status === 'cancelled'
                            ? 'bg-gray-200 text-gray-500 line-through'
                            : app.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        title={`${formatTime(app.time)} - ${app.patientName}`}
                      >
                        {formatTime(app.time)} {app.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayData.appointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayData.appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 mr-1"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-300 mr-1"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 border border-gray-400 mr-1"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
        <div className="text-red-600 mb-2">⚠️</div>
        <h3 className="mt-2 font-medium text-gray-900 text-lg">Error</h3>
        <p className="mt-1 text-gray-500 text-sm">{error}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={refresh}
          className="mt-4"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">My Appointments</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and view all your patient appointments
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
            className="mr-2"
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={refresh}
            className="mr-2"
          >
            Refresh
          </Button>
          <div className="flex border border-gray-200 rounded-md overflow-hidden ml-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${view === "list"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setView("list")}
            >
              List
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${view === "calendar"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient name, symptoms, or notes..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Status
              </label>
              <select
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Type
              </label>
              <select
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Date
              </label>
              <input
                type="date"
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              {dateFilter && (
                <button
                  type="button"
                  className="text-xs text-red-600 mt-1 hover:text-red-800"
                  onClick={() => setDateFilter("")}
                >
                  Clear date filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {view === "list" && (
        <div className="space-y-6">
          {/* All Appointments grouped by date */}
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <Card key={date}>
                <CardHeader className="bg-gray-50 border-gray-100 border-b">
                  <CardTitle className="font-medium text-gray-900 text-lg">
                    {getRelativeDateLabel(date)} - {formatDate(date)}
                    {isToday(date) && (
                      <span className="ml-2 text-sm font-normal text-red-600">
                        (Today)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-gray-100">
                  {groupedAppointments[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => {
                      const patient = appointment.patient;
                      return (
                        <div
                          key={appointment.id}
                          className={`flex items-center hover:bg-gray-50 -mx-2 px-2 py-4 first:pt-2 last:pb-2 rounded-md transition-colors ${
                            appointment.status === "cancelled" ? "opacity-70" : ""
                          }`}
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className="flex flex-col justify-center items-center w-16 text-center">
                              <span className={`font-semibold text-sm ${
                                appointment.status === "cancelled" ? "text-gray-500" : "text-gray-900"
                              }`}>
                                {formatTime(appointment.time)}
                              </span>
                              <span className={`mt-1 text-xs ${
                                appointment.status === "cancelled" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {appointment.duration} min
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0 mr-4">
                            <Avatar
                              src={patient?.avatar}
                              alt={appointment.patientName}
                              size="md"
                              status={
                                appointment.status === "cancelled" 
                                  ? "offline"
                                  : patient?.status === "critical"
                                  ? "busy"
                                  : patient?.status === "moderate"
                                  ? "away"
                                  : "online"
                              }
                            />
                          </div>

                          <div className="flex-grow min-w-0">
                            <p className={`font-medium text-sm ${
                              appointment.status === "cancelled" ? "text-gray-500" : "text-gray-900"
                            }`}>
                              {appointment.patientName}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge
                                text={appointment.type}
                                variant={appointment.status === "cancelled" ? "secondary" : "primary"}
                                size="small"
                              />
                              {patient?.status === "critical" && appointment.status !== "cancelled" && (
                                <Badge
                                  text="Critical"
                                  variant="danger"
                                  size="small"
                                  className="ml-2"
                                />
                              )}
                            </div>
                            {appointment.notes && (
                              <p className={`mt-1 text-xs line-clamp-1 ${
                                appointment.status === "cancelled" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {appointment.notes}
                              </p>
                            )}
                            {appointment.symptoms && (
                              <p className={`mt-1 text-xs line-clamp-1 ${
                                appointment.status === "cancelled" ? "text-gray-400" : "text-blue-600"
                              }`}>
                                <strong>Symptoms:</strong> {appointment.symptoms}
                              </p>
                            )}
                          </div>

                          <div className="flex-shrink-0 ml-4">
                            <Badge
                              text={appointment.status}
                              variant={
                                appointment.status === "scheduled"
                                  ? "primary"
                                  : appointment.status === "completed"
                                  ? "success"
                                  : appointment.status === "cancelled"
                                  ? "danger"
                                  : "warning"
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
              <Calendar className="mx-auto w-12 h-12 text-gray-300" />
              <h3 className="mt-2 font-medium text-gray-900 text-lg">
                No appointments found
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}

      {view === "calendar" && <CalendarView />}
    </div>
  );
}

export default AppointmentsList;



