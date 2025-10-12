// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Calendar,
//   MessageSquare,
//   Users,
//   AlertTriangle,
//   FileText,
//   Settings,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { supabase } from "../../services/supabaseClient";

// function Sidebar({ isSidebarOpen, toggleSidebar }) {
//   const location = useLocation();
//   const [waitingTriageCount, setWaitingTriageCount] = useState(0);

//   // Fetch and subscribe to waiting triage cases count
//   useEffect(() => {
//     let subscription;

//     const fetchAndSubscribe = async () => {
//       try {
//         // Initial fetch of waiting cases count
//         const { count, error } = await supabase
//           .from('triage_cases')
//           .select('*', { count: 'exact', head: true })
//           .eq('status', 'waiting');
        
//         if (error) throw error;
//         setWaitingTriageCount(count || 0);

//         // Set up realtime subscription
//         subscription = supabase
//           .channel('triage-cases-changes')
//           .on(
//             'postgres_changes',
//             {
//               event: '*',
//               schema: 'public',
//               table: 'triage_cases',
//             },
//             async (payload) => {
//               // Only refetch if the change affects a waiting case
//               if (payload.eventType === 'DELETE' || 
//                   payload.new?.status === 'waiting' || 
//                   payload.old?.status === 'waiting') {
//                 const { count, error } = await supabase
//                   .from('triage_cases')
//                   .select('*', { count: 'exact', head: true })
//                   .eq('status', 'waiting');
                
//                 if (!error) {
//                   setWaitingTriageCount(count || 0);
//                 }
//               }
//             }
//           )
//           .subscribe();

//       } catch (err) {
//         console.error('Error initializing triage count:', err);
//       }
//     };

//     fetchAndSubscribe();

//     return () => {
//       if (subscription) {
//         supabase.removeChannel(subscription);
//       }
//     };
//   }, []);

//   const navItems = [
//     { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
//     { name: "Appointments", path: "/dashboard/appointments", icon: <Calendar className="w-5 h-5" /> },
//     { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
//     { name: "Patients", path: "/dashboard/patients", icon: <Users className="w-5 h-5" /> },
//     { 
//       name: "Triage", 
//       path: "/dashboard/triage", 
//       icon: <AlertTriangle className="w-5 h-5" />, 
//       badge: waitingTriageCount > 0 ? waitingTriageCount : null 
//     },
//     { name: "Medical Records", path: "/dashboard/records", icon: <FileText className="w-5 h-5" /> },
    
//   ];

//   return (
//     <aside
//       className={`
//         fixed lg:static top-0 left-0 h-full w-64 z-30 bg-white shadow-md border-r border-gray-200
//         transform transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0
//       `}
//     >
//       <div className="px-4 py-5">
//         <div className="flex items-center">
//           <img
//             src="./assets/images/mpiloLogo.png"
//             alt="Mpilo Mobile Logo"
//             className="w-8 h-8 rounded-full object-cover"
//           />
//           <span className="ml-2 font-bold text-[#274D60] text-xl">Mpilo Mobile</span>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         <nav className="px-2 py-4">
//           <ul className="space-y-1">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <li key={item.name}>
//                   <Link
//                     to={item.path}
//                     className={`
//                       flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group
//                       ${
//                         isActive
//                           ? "bg-red-50 text-red-700"
//                           : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                       }
//                     `}
//                     onClick={() => toggleSidebar && toggleSidebar()} 
//                   >
//                     <div className="flex items-center">
//                       <span
//                         className={
//                           isActive
//                             ? "text-red-600"
//                             : "text-gray-500 group-hover:text-gray-700"
//                         }
//                       >
//                         {item.icon}
//                       </span>
//                       <span className="ml-3 font-medium">{item.name}</span>
//                     </div>
//                     {item.badge && (
//                       <span className="inline-flex items-center bg-red-100 px-2 py-0.5 rounded-full font-medium text-red-800 text-xs">
//                         {item.badge}
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>

//       <div className="p-4 border-t border-gray-200">
//         <Link
//           to="/dashboard/settings"
//           className="flex items-center hover:bg-gray-100 px-3 py-2.5 rounded-lg text-gray-700 hover:text-gray-900"
//         >
//           <Settings className="w-5 h-5 text-gray-500" />
//           <span className="ml-3 font-medium">Settings</span>
//         </Link>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;










import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  MessageSquare,
  Users,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthProvider"; // Import the hook, not the provider

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const [waitingTriageCount, setWaitingTriageCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { user } = useAuth(); // Use the hook directly

  // Fetch and subscribe to waiting triage cases count
  useEffect(() => {
    let triageSubscription;

    const fetchAndSubscribeTriage = async () => {
      try {
        // Initial fetch of waiting cases count
        const { count, error } = await supabase
          .from('triage_cases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting');
        
        if (error) throw error;
        setWaitingTriageCount(count || 0);

        // Set up realtime subscription for triage cases
        triageSubscription = supabase
          .channel('triage-cases-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'triage_cases',
            },
            async (payload) => {
              // Only refetch if the change affects a waiting case
              if (payload.eventType === 'DELETE' || 
                  payload.new?.status === 'waiting' || 
                  payload.old?.status === 'waiting') {
                const { count, error } = await supabase
                  .from('triage_cases')
                  .select('*', { count: 'exact', head: true })
                  .eq('status', 'waiting');
                
                if (!error) {
                  setWaitingTriageCount(count || 0);
                }
              }
            }
          )
          .subscribe();

      } catch (err) {
        console.error('Error initializing triage count:', err);
      }
    };

    fetchAndSubscribeTriage();

    return () => {
      if (triageSubscription) {
        supabase.removeChannel(triageSubscription);
      }
    };
  }, []);

  // Fetch and subscribe to unread messages count
  useEffect(() => {
    if (!user?.id) return;

    let messagesSubscription;

    const fetchAndSubscribeMessages = async () => {
      try {
        // Initial fetch of unread messages count for current user
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);
        
        if (error) throw error;
        setUnreadMessagesCount(count || 0);

        // Set up realtime subscription for messages
        messagesSubscription = supabase
          .channel('messages-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `recipient_id=eq.${user.id}`,
            },
            async (payload) => {
              // Refetch unread count when messages change
              const { count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', user.id)
                .eq('is_read', false);
              
              if (!error) {
                setUnreadMessagesCount(count || 0);
              }
            }
          )
          .subscribe();

      } catch (err) {
        console.error('Error initializing messages count:', err);
      }
    };

    fetchAndSubscribeMessages();

    return () => {
      if (messagesSubscription) {
        supabase.removeChannel(messagesSubscription);
      }
    };
  }, [user?.id]); // Re-run when user id changes

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Appointments", path: "/dashboard/appointments", icon: <Calendar className="w-5 h-5" /> },
    { 
      name: "Messages", 
      path: "/dashboard/messages", 
      icon: <MessageSquare className="w-5 h-5" />, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null 
    },
    { name: "Patients", path: "/dashboard/patients", icon: <Users className="w-5 h-5" /> },
    { 
      name: "Triage", 
      path: "/dashboard/triage", 
      icon: <AlertTriangle className="w-5 h-5" />, 
      badge: waitingTriageCount > 0 ? waitingTriageCount : null 
    },
    { name: "Medical Records", path: "/dashboard/records", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 h-full w-64 z-30 bg-white shadow-md border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div className="px-4 py-5">
        <div className="flex items-center">
          <img
            src="./assets/images/mpiloLogo.png"
            alt="Mpilo Mobile Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="ml-2 font-bold text-[#274D60] text-xl">Mpilo Mobile</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group
                      ${
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                    onClick={() => toggleSidebar && toggleSidebar()} 
                  >
                    <div className="flex items-center">
                      <span
                        className={
                          isActive
                            ? "text-red-600"
                            : "text-gray-500 group-hover:text-gray-700"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center bg-red-100 px-2 py-0.5 rounded-full font-medium text-red-800 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/dashboard/settings"
          className="flex items-center hover:bg-gray-100 px-3 py-2.5 rounded-lg text-gray-700 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="ml-3 font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;