// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   MessageSquare,
//   Search,
//   Plus,
//   Filter,
//   Mail,
//   X,
//   Check,
//   Send,
//   ArrowLeft,
//   Shield,
// } from "lucide-react";
// import { useAuth } from "@/context";
// import {
//   getUserConversations,
//   getConversationMessages,
//   sendMessage as sendMessageAPI,
//   markMessagesAsRead,
//   getOrCreateConversation,
//   getAllDoctors,
//   subscribeToMessages,
//   decryptMessage,
// } from "@/services";
// import profile from "../../../public/assets/images/profileImg.png";

// // Avatar component
// const Avatar = ({ src, alt, size = "md", className = "" }) => {
//   const sizeClasses = {
//     sm: "w-8 h-8",
//     md: "w-10 h-10",
//     lg: "w-12 h-12",
//   };

//   return (
//     <div className={`relative ${className}`}>
//       <img
//         src={
//           src ||
//           `https://ui-avatars.com/api/?name=${encodeURIComponent(
//             alt
//           )}&background=ef4444&color=fff`
//         }
//         alt={alt}
//         className={`${sizeClasses[size]} rounded-full object-cover`}
//       />
//     </div>
//   );
// };

// // Badge component
// const Badge = ({ text, variant = "default", size = "default" }) => {
//   const variants = {
//     default: "bg-gray-100 text-gray-800",
//     danger: "bg-red-100 text-red-800",
//     success: "bg-green-100 text-green-800",
//     warning: "bg-yellow-100 text-yellow-800",
//   };

//   const sizes = {
//     small: "px-2 py-1 text-xs",
//     default: "px-3 py-1 text-sm",
//   };

//   return (
//     <span
//       className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
//     >
//       {text}
//     </span>
//   );
// };

// // Button component
// const Button = ({
//   children,
//   variant = "default",
//   size = "default",
//   icon,
//   onClick,
//   disabled,
//   className = "",
//   loading = false,
// }) => {
//   const variants = {
//     default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
//     primary: "bg-red-600 text-white border-transparent hover:bg-red-700",
//     secondary: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200",
//     danger: "bg-red-600 text-white border-transparent hover:bg-red-700",
//   };

//   const sizes = {
//     sm: "px-3 py-1.5 text-sm",
//     default: "px-4 py-2 text-sm",
//     lg: "px-6 py-3 text-base",
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled || loading}
//       className={`inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
//     >
//       {icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// // Modal component (modernized)
// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
//           <Button
//             variant="ghost"
//             size="sm"
//             icon={<X className="w-4 h-4 text-center ml-3 text-red-600" />}
//             onClick={onClose}
//             className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center w-8 h-8"
//           />
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// function AdminMessagesNew() {
//   const { user } = useAuth();
  
//   // Core state
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState({});
//   const [newMessage, setNewMessage] = useState("");

//   // UI state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [newMessageModalOpen, setNewMessageModalOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [doctors, setDoctors] = useState([]);
//   const [doctorQuery, setDoctorQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Mobile state
//   const [isMobile, setIsMobile] = useState(false);
//   const [showConversationsList, setShowConversationsList] = useState(true);

//   // Refs
//   const messagesEndRef = useRef(null);
//   const messageSubscription = useRef(null);

//   // Check for mobile screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setShowConversationsList(true);
//       }
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       if (!user?.id) return;
      
//       try {
//         setLoading(true);
        
//         // Load conversations
//         const convs = await getUserConversations(user.id);
//         setConversations(convs);
        
//         // Load doctors for new conversations
//         const docs = await getAllDoctors();
//         setDoctors(docs);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [user]);

//   // Auto-scroll to bottom of messages
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, selectedConversation, scrollToBottom]);

//   // Load messages when conversation is selected
//   useEffect(() => {
//     const loadMessages = async () => {
//       if (!selectedConversation?.id) return;

//       try {
//         const msgs = await getConversationMessages(selectedConversation.id);
//         setMessages(prev => ({
//           ...prev,
//           [selectedConversation.id]: msgs
//         }));

//         // Mark as read
//         if (user?.id) {
//           await markMessagesAsRead(selectedConversation.id, user.id);
//         }

//         // Subscribe to new messages
//         if (messageSubscription.current) {
//           messageSubscription.current.unsubscribe();
//         }

//         messageSubscription.current = subscribeToMessages(
//           selectedConversation.id,
//           (newMsg) => {
//             setMessages(prev => ({
//               ...prev,
//               [selectedConversation.id]: [
//                 ...(prev[selectedConversation.id] || []),
//                 newMsg
//               ]
//             }));

//             // Mark as read if it's from the other person
//             if (newMsg.sender_id !== user?.id) {
//               markMessagesAsRead(selectedConversation.id, user.id);
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Error loading messages:", error);
//       }
//     };

//     loadMessages();

//     return () => {
//       if (messageSubscription.current) {
//         messageSubscription.current.unsubscribe();
//       }
//     };
//   }, [selectedConversation, user]);

//   // Send message function
//   const sendMessageHandler = async () => {
//     if (!newMessage.trim() || !selectedConversation || !user?.id) return;

//     setSendingMessage(true);
//     document.querySelector("textarea")?.style && (document.querySelector("textarea").style.height = "auto");

//     const optimisticMessage = {
//       id: `temp-${Date.now()}`,
//       conversation_id: selectedConversation.id,
//       sender_id: user.id,
//       sender: {
//         id: user.id,
//         display_name: user.display_name || user.email,
//         avatar_url: user.avatar_url
//       },
//       content: newMessage.trim(),
//       created_at: new Date().toISOString(),
//       is_read: true,
//       is_urgent: false,
//     };

//     // Add message optimistically
//     setMessages((prev) => ({
//       ...prev,
//       [selectedConversation.id]: [
//         ...(prev[selectedConversation.id] || []),
//         optimisticMessage,
//       ],
//     }));

//     const messageContent = newMessage.trim();
//     setNewMessage("");

//     try {
//       await sendMessageAPI({
//         conversationId: selectedConversation.id,
//         senderId: user.id,
//         recipientId: selectedConversation.participant.id,
//         content: messageContent,
//         urgent: false,
//       });

//       // Refresh conversations to update last message
//       const convs = await getUserConversations(user.id);
//       setConversations(convs);
//     } catch (error) {
//       console.error("Error sending message:", error);

//       // Remove failed message
//       setMessages((prev) => ({
//         ...prev,
//         [selectedConversation.id]: prev[selectedConversation.id].filter(
//           (msg) => msg.id !== optimisticMessage.id
//         ),
//       }));

//       // Restore message to input
//       setNewMessage(messageContent);
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   // Handle conversation selection
//   const handleConversationSelect = useCallback(
//     (conversation) => {
//       setSelectedConversation(conversation);

//       // On mobile, hide conversations list when selecting a conversation
//       if (isMobile) {
//         setShowConversationsList(false);
//       }
//     },
//     [isMobile]
//   );

//   // Handle back to conversations (mobile)
//   const handleBackToConversations = () => {
//     setShowConversationsList(true);
//     setSelectedConversation(null);
//   };

//   // Create new conversation with selected doctor
//   const handleCreateConversation = async () => {
//     if (!selectedDoctor || !user?.id) return;

//     try {
//       const conversation = await getOrCreateConversation(user.id, selectedDoctor.user_id);
      
//       const newConv = {
//         id: conversation.id,
//         participant: {
//           id: selectedDoctor.user_id,
//           display_name: `Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name}`,
//           avatar_url: selectedDoctor.profile_image_url,
//           email: selectedDoctor.email
//         },
//         lastMessage: null,
//         updatedAt: conversation.updated_at
//       };

//       setConversations(prev => [newConv, ...prev]);
//       setSelectedConversation(newConv);

//       // On mobile, show the message view
//       if (isMobile) {
//         setShowConversationsList(false);
//       }

//       setNewMessageModalOpen(false);
//       setSelectedDoctor(null);
//     } catch (error) {
//       console.error("Error creating conversation:", error);
//     }
//   };

//   // Filter conversations
//   const filteredConversations = conversations.filter((conv) => {
//     const matchesSearch =
//       conv.participant?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       conv.participant?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (conv.lastMessage?.content &&
//         decryptMessage(conv.lastMessage.content)
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()));

//     const matchesFilter =
//       filter === "all" ||
//       (filter === "unread" && conv.lastMessage && !conv.lastMessage.is_read && conv.lastMessage.recipient_id === user?.id) ||
//       (filter === "urgent" && conv.lastMessage?.is_urgent);

//     return matchesSearch && matchesFilter;
//   });

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const isToday = date.toDateString() === now.toDateString();

//     if (isToday) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else {
//       return date.toLocaleDateString();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* Mobile: Conversations List View */}
//       {isMobile && showConversationsList && (
//         <>
//           {/* Header */}
//           <div className="bg-white border-b border-gray-200 px-4 py-3">
//             <div className="flex justify-between items-center">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-3xl sm:text-3xl font-bold text-black">
//                     Messages
//                   </span>
//                   <Shield className="w-5 h-5 text-green-600" title="End-to-end encrypted" />
//                 </div>
//                 <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
//                   Secure encrypted messaging
//                 </p>
//               </div>

//               <div className="flex space-x-2">
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   icon={<Filter className="w-4 h-4" />}
//                   onClick={() => setFilterOpen(!filterOpen)}
//                 />
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   icon={
//                     <Plus className="w-4 h-4 ml-2 sm:w-4 sm:h-4 text-center" />
//                   }
//                   onClick={() => setNewMessageModalOpen(true)}
//                 />
//               </div>
//             </div>

//             {/* Search */}
//             <div className="mt-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search conversations..."
//                   className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-sm"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>

//               {filterOpen && (
//                 <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm mt-2">
//                   <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2">
//                     {["all", "unread", "urgent"].map((filterOption) => (
//                       <button
//                         key={filterOption}
//                         className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium capitalize ${
//                           filter === filterOption
//                             ? "bg-red-100 text-red-800"
//                             : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         }`}
//                         onClick={() => setFilter(filterOption)}
//                       >
//                         {filterOption}{" "}
//                         {filterOption === "all" ? "Messages" : ""}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {filteredConversations.length > 0 ? (
//               filteredConversations.map((conversation) => (
//                 <div
//                   key={conversation.id}
//                   className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
//                   onClick={() => handleConversationSelect(conversation)}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <Avatar
//                       src={conversation.participant?.avatar_url || profile}
//                       alt={conversation.participant?.display_name || "User"}
//                       size="md"
//                     />

//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <p className="font-semibold text-gray-900 truncate">
//                           {conversation.participant?.display_name || conversation.participant?.email || "Unknown"}
//                         </p>
//                         <div className="flex items-center space-x-2">
//                           {conversation.lastMessage && (
//                             <span className="text-xs text-gray-500">
//                               {formatTime(conversation.lastMessage.created_at)}
//                             </span>
//                           )}
//                           {conversation.lastMessage && 
//                            !conversation.lastMessage.is_read && 
//                            conversation.lastMessage.recipient_id === user?.id && (
//                             <span className="bg-red-600 text-white text-xs rounded-full w-2 h-2"></span>
//                           )}
//                         </div>
//                       </div>

//                       {conversation.lastMessage && (
//                         <p className="text-sm text-gray-600 truncate mt-1">
//                           {conversation.lastMessage.sender_id === user?.id
//                             ? "You: "
//                             : ""}
//                           {decryptMessage(conversation.lastMessage.content)}
//                         </p>
//                       )}

//                       {conversation.lastMessage?.is_urgent && (
//                         <Badge
//                           text="Urgent"
//                           variant="danger"
//                           size="small"
//                           className="mt-1"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-8 text-center">
//                 <Mail className="w-12 h-12 text-gray-300 mx-auto" />
//                 <p className="text-gray-500 mt-2">No conversations found</p>
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   className="mt-4"
//                   onClick={() => setNewMessageModalOpen(true)}
//                 >
//                   Start a conversation
//                 </Button>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Mobile: Message View */}
//       {isMobile && !showConversationsList && selectedConversation && (
//         <>
//           {/* Message Header */}
//           <div className="bg-white border-b border-gray-200 p-4">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={handleBackToConversations}
//                 className="p-1 hover:bg-gray-100 rounded-md"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <Avatar
//                 src={selectedConversation.participant?.avatar_url || profile}
//                 alt={selectedConversation.participant?.display_name || "User"}
//                 size="md"
//               />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-900">
//                   {selectedConversation.participant?.display_name || selectedConversation.participant?.email}
//                 </h3>
//                 <div className="flex items-center gap-1 text-xs text-gray-500">
//                   <Shield className="w-3 h-3 text-green-600" />
//                   <span>Encrypted</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {(messages[selectedConversation.id] || []).map((message) => {
//               const isCurrentUser = message.sender_id === user?.id;
//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${
//                     isCurrentUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div className="max-w-[75%]">
//                     <div
//                       className={`px-4 py-3 rounded-lg ${
//                         isCurrentUser
//                           ? "bg-red-600 text-white"
//                           : "bg-gray-100 text-gray-900"
//                       }`}
//                     >
//                       <p className="whitespace-pre-wrap break-words">{message.content}</p>
//                       {message.is_urgent && (
//                         <Badge
//                           text="Urgent"
//                           variant="danger"
//                           size="small"
//                           className="mt-2"
//                         />
//                       )}
//                     </div>
//                     <div
//                       className={`flex items-center mt-2 ${
//                         isCurrentUser ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <span className="text-xs text-gray-500">
//                         {formatTime(message.created_at)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input Bar */}
//           <div className="bg-white border-t border-gray-200 p-4 flex items-end">
//             <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 bg-slate-50">
//               <textarea
//                 value={newMessage}
//                 onChange={(e) => {
//                   setNewMessage(e.target.value);
//                   e.target.style.height = "auto";
//                   e.target.style.height = e.target.scrollHeight + "px";
//                 }}
//                 placeholder="Type your message..."
//                 className="flex-1 text-sm text-gray-800 bg-transparent resize-none focus:outline-none leading-tight py-2"
//                 rows={1}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//                     e.preventDefault();
//                     sendMessageHandler();
//                   }
//                 }}
//               />
//             </div>

//             <Button
//               variant="primary"
//               disabled={!newMessage.trim() || sendingMessage}
//               onClick={sendMessageHandler}
//               className="ml-1 px-3 py-2 h-[35px] rounded-md flex items-center justify-center space-x-1"
//             >
//               <Send className="w-4 h-5" />
//               {sendingMessage && (
//                 <span className="hidden sm:inline">Sending...</span>
//               )}
//             </Button>
//           </div>
//         </>
//       )}

//       {/* Desktop Layout */}
//       {!isMobile && (
//         <>
//           {/* Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-[30px] font-bold text-gray-900">
//                     Messages
//                   </span>
//                   <Shield className="w-6 h-6 text-green-600" title="End-to-end encrypted" />
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Secure encrypted communication with doctors
//                 </p>
//               </div>

//               <div className="flex space-x-4">
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   icon={<Filter className="w-4 h-4" />}
//                   onClick={() => setFilterOpen(!filterOpen)}
//                   className="mr-2"
//                 >
//                   Filter
//                 </Button>
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   icon={<Plus className="w-4 h-4 sm:w-4 sm:h-4 text-center" />}
//                   onClick={() => setNewMessageModalOpen(true)}
//                 >
//                   New Message
//                 </Button>
//               </div>
//             </div>

//             {/* Search and Filters */}
//             <div className="mt-4 flex flex-col space-y-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search conversations..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>

//               {filterOpen && (
//                 <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                   <div className="flex space-x-4">
//                     {["all", "unread", "urgent"].map((filterOption) => (
//                       <button
//                         key={filterOption}
//                         className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
//                           filter === filterOption
//                             ? "bg-red-100 text-red-800"
//                             : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                         }`}
//                         onClick={() => setFilter(filterOption)}
//                       >
//                         {filterOption}{" "}
//                         {filterOption === "all" ? "Messages" : ""}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 flex overflow-hidden">
//             {/* Conversations List */}
//             <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="font-semibold text-gray-900">
//                   Conversations ({filteredConversations.length})
//                 </h2>
//               </div>

//               <div className="flex-1 overflow-y-auto">
//                 {filteredConversations.length > 0 ? (
//                   filteredConversations.map((conversation) => (
//                     <div
//                       key={conversation.id}
//                       className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
//                         selectedConversation?.id === conversation.id
//                           ? "bg-red-50 border-red-200"
//                           : "hover:bg-gray-50"
//                       }`}
//                       onClick={() => handleConversationSelect(conversation)}
//                     >
//                       <div className="flex items-start space-x-3">
//                         <Avatar
//                           src={conversation.participant?.avatar_url || profile}
//                           alt={conversation.participant?.display_name || "User"}
//                           size="md"
//                         />

//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-center">
//                             <p className="font-semibold text-gray-900 truncate">
//                               {conversation.participant?.display_name || conversation.participant?.email}
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               {conversation.lastMessage && (
//                                 <span className="text-xs text-gray-500">
//                                   {formatTime(
//                                     conversation.lastMessage.created_at
//                                   )}
//                                 </span>
//                               )}
//                               {conversation.lastMessage && 
//                                !conversation.lastMessage.is_read && 
//                                conversation.lastMessage.recipient_id === user?.id && (
//                                 <span className="bg-red-600 text-white text-xs rounded-full w-2 h-2"></span>
//                               )}
//                             </div>
//                           </div>

//                           {conversation.lastMessage && (
//                             <p className="text-sm text-gray-600 truncate mt-1">
//                               {conversation.lastMessage.sender_id ===
//                               user?.id
//                                 ? "You: "
//                                 : ""}
//                               {decryptMessage(conversation.lastMessage.content)}
//                             </p>
//                           )}

//                           {conversation.lastMessage?.is_urgent && (
//                             <Badge
//                               text="Urgent"
//                               variant="danger"
//                               size="small"
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-8 text-center">
//                     <Mail className="w-12 h-12 text-gray-300 mx-auto" />
//                     <p className="text-gray-500 mt-2">No conversations found</p>
//                     <Button
//                       variant="primary"
//                       size="sm"
//                       className="mt-4"
//                       onClick={() => setNewMessageModalOpen(true)}
//                     >
//                       Start a conversation
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Message View */}
//             <div className="flex-1 flex flex-col">
//               {selectedConversation ? (
//                 <>
//                   {/* Message Header */}
//                   <div className="bg-white border-b border-gray-200 p-4">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center space-x-3">
//                         <Avatar
//                           src={selectedConversation.participant?.avatar_url || profile}
//                           alt={selectedConversation.participant?.display_name || "User"}
//                           size="md"
//                         />
//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             {selectedConversation.participant?.display_name || selectedConversation.participant?.email}
//                           </h3>
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Shield className="w-3 h-3 text-green-600" />
//                             <span>End-to-end encrypted</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Messages */}
//                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                     {(messages[selectedConversation.id] || []).map(
//                       (message) => {
//                         const isCurrentUser =
//                           message.sender_id === user?.id;
//                         return (
//                           <div
//                             key={message.id}
//                             className={`flex ${
//                               isCurrentUser ? "justify-end" : "justify-start"
//                             }`}
//                           >
//                             <div className="max-w-[65%]">
//                               <div
//                                 className={`px-4 py-3 rounded-lg ${
//                                   isCurrentUser
//                                     ? "bg-red-600 text-white"
//                                     : "bg-gray-100 text-gray-900"
//                                 }`}
//                               >
//                                 <p className="whitespace-pre-wrap break-words">
//                                   {message.content}
//                                 </p>
//                                 {message.is_urgent && (
//                                   <Badge
//                                     text="Urgent"
//                                     variant="danger"
//                                     size="small"
//                                     className="mt-2"
//                                   />
//                                 )}
//                               </div>
//                               <div
//                                 className={`flex items-center mt-2 ${
//                                   isCurrentUser
//                                     ? "justify-end"
//                                     : "justify-start"
//                                 }`}
//                               >
//                                 <span className="text-xs text-gray-500">
//                                   {formatTime(message.created_at)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Message Input Bar */}
//                   <div className="bg-white border-t border-gray-200 p-4 flex items-end">
//                     <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 bg-slate-50">
//                       <textarea
//                         value={newMessage}
//                         onChange={(e) => {
//                           setNewMessage(e.target.value);
//                           e.target.style.height = "auto";
//                           e.target.style.height = e.target.scrollHeight + "px";
//                         }}
//                         placeholder="Type your message..."
//                         className="flex-1 text-sm text-gray-800 bg-transparent resize-none focus:outline-none leading-tight py-2"
//                         rows={1}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//                             e.preventDefault();
//                             sendMessageHandler();
//                           }
//                         }}
//                       />
//                     </div>

//                     <Button
//                       variant="primary"
//                       disabled={!newMessage.trim() || sendingMessage}
//                       onClick={sendMessageHandler}
//                       className="ml-3 px-3 py-2 h-[35px] rounded-md flex items-center justify-center"
//                     >
//                       {sendingMessage ? (
//                         "Sending..."
//                       ) : (
//                         <Send className="w-5 h-5" />
//                       )}
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center bg-gray-50">
//                   <div className="text-center">
//                     <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
//                     <h3 className="text-lg font-semibold text-gray-900 mt-4">
//                       Select a conversation
//                     </h3>
//                     <p className="text-gray-500 mt-2">
//                       Choose a conversation from the list to view messages
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* New Message Modal */}
//       <Modal
//         isOpen={newMessageModalOpen}
//         onClose={() => {
//           setNewMessageModalOpen(false);
//           setSelectedDoctor(null);
//           setDoctorQuery("");
//         }}
//         title="New Message to Doctor"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select doctor</label>

//             <div className="relative mb-3">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search doctor by name or specialization..."
//                 value={doctorQuery}
//                 onChange={(e) => setDoctorQuery(e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
//               {doctors
//                 .filter((d) => {
//                   const q = doctorQuery.trim().toLowerCase();
//                   if (!q) return true;
//                   const name = `${d.first_name} ${d.last_name}`.toLowerCase();
//                   const spec = (d.specialization || "").toLowerCase();
//                   return name.includes(q) || spec.includes(q) || (d.email || "").toLowerCase().includes(q);
//                 })
//                 .map((doctor) => {
//                   const isSelected = selectedDoctor?.id === doctor.id;
//                   return (
//                     <div
//                       key={doctor.id}
//                       role="button"
//                       tabIndex={0}
//                       onClick={() => setSelectedDoctor(doctor)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") setSelectedDoctor(doctor);
//                       }}
//                       aria-pressed={isSelected}
//                       className={`relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-shadow border ${isSelected ? 'bg-red-50 border-red-200 shadow-sm' : 'border-transparent hover:shadow-sm hover:bg-gray-50'}`}
//                     >
//                         <div className="flex-shrink-0 mr-3">
//                           {isSelected ? (
//                             <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
//                               <Check className="w-3 h-3" />
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-gray-200 text-transparent">
//                               <Check className="w-3 h-3" />
//                             </span>
//                           )}
//                         </div>
//                         <Avatar
//                           src={doctor.profile_image_url || profile}
//                           alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
//                           size="md"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-900 truncate">Dr. {doctor.first_name} {doctor.last_name}</p>
//                           <p className="text-sm text-gray-500 truncate">{doctor.specialization}</p>
//                         </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setNewMessageModalOpen(false);
//                 setSelectedDoctor(null);
//                 setDoctorQuery("");
//               }}
//               className="w-full text-center sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 handleCreateConversation();
//                 setDoctorQuery("");
//               }}
//               disabled={!selectedDoctor}
//               className="w-full text-center sm:w-auto"
//             >
//               Start Conversation
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default AdminMessagesNew;















import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  Mail,
  X,
  Check,
  Send,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context";
import {
  getUserConversations,
  getConversationMessages,
  sendMessage as sendMessageAPI,
  markMessagesAsRead,
  getOrCreateConversation,
  getAllDoctors,
  subscribeToMessages,
  decryptMessage,
  subscribeToConversations,
} from "@/services";
import profile from "../../../public/assets/images/profileImg.png";

// Avatar component
const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={
          src ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            alt
          )}&background=ef4444&color=fff`
        }
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    </div>
  );
};

// Badge component
const Badge = ({ text, variant = "default", size = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    danger: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  const sizes = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {text}
    </span>
  );
};

// Button component
const Button = ({
  children,
  variant = "default",
  size = "default",
  icon,
  onClick,
  disabled,
  className = "",
  loading = false,
}) => {
  const variants = {
    default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    primary: "bg-red-600 text-white border-transparent hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200",
    danger: "bg-red-600 text-white border-transparent hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Modal component (modernized)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4 text-center ml-3 text-red-600" />}
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center w-8 h-8"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

function AdminMessagesNew() {
  const { user } = useAuth();
  
  // Core state
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationsList, setShowConversationsList] = useState(true);

  // Refs
  const messagesEndRef = useRef(null);
  const messageSubscription = useRef(null);
  const conversationSubscription = useRef(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversationsList(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Load conversations with their latest messages
        const convs = await getUserConversations(user.id);
        setConversations(convs);
        
        // Load doctors for new conversations
        const docs = await getAllDoctors();
        setDoctors(docs);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Refresh conversations function
  const refreshConversations = async () => {
    if (!user?.id) return;
    
    try {
      const convs = await getUserConversations(user.id);
      setConversations(convs);
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation, scrollToBottom]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?.id) return;

      try {
        const msgs = await getConversationMessages(selectedConversation.id);
        setMessages(prev => ({
          ...prev,
          [selectedConversation.id]: msgs
        }));

        // Mark as read
        if (user?.id) {
          await markMessagesAsRead(selectedConversation.id, user.id);
          // Refresh conversations to update read status
          refreshConversations();
        }

        // Subscribe to new messages
        if (messageSubscription.current) {
          messageSubscription.current.unsubscribe();
        }

        messageSubscription.current = subscribeToMessages(
          selectedConversation.id,
          (newMsg) => {
            setMessages(prev => ({
              ...prev,
              [selectedConversation.id]: [
                ...(prev[selectedConversation.id] || []),
                newMsg
              ]
            }));

            // Mark as read if it's from the other person and refresh conversations
            if (newMsg.sender_id !== user?.id) {
              markMessagesAsRead(selectedConversation.id, user.id);
              refreshConversations();
            }
          }
        );
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();

    return () => {
      if (messageSubscription.current) {
        messageSubscription.current.unsubscribe();
      }
    };
  }, [selectedConversation, user]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!user?.id) return;

    if (conversationSubscription.current) {
      conversationSubscription.current.unsubscribe();
    }

    conversationSubscription.current = subscribeToConversations(user.id, (payload) => {
      // Refresh conversations when they are updated
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        refreshConversations();
      }
    });

    return () => {
      if (conversationSubscription.current) {
        conversationSubscription.current.unsubscribe();
      }
    };
  }, [user]);

  // Send message function
  const sendMessageHandler = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    setSendingMessage(true);
    document.querySelector("textarea")?.style && (document.querySelector("textarea").style.height = "auto");

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      sender: {
        id: user.id,
        display_name: user.display_name || user.email,
        avatar_url: user.avatar_url
      },
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      is_read: true,
      is_urgent: false,
    };

    // Add message optimistically
    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        optimisticMessage,
      ],
    }));

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      await sendMessageAPI({
        conversationId: selectedConversation.id,
        senderId: user.id,
        recipientId: selectedConversation.participant.id,
        content: messageContent,
        urgent: false,
      });

      // Refresh conversations to update last message
      await refreshConversations();
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove failed message
      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].filter(
          (msg) => msg.id !== optimisticMessage.id
        ),
      }));

      // Restore message to input
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = useCallback(
    (conversation) => {
      setSelectedConversation(conversation);

      // On mobile, hide conversations list when selecting a conversation
      if (isMobile) {
        setShowConversationsList(false);
      }
    },
    [isMobile]
  );

  // Handle back to conversations (mobile)
  const handleBackToConversations = () => {
    setShowConversationsList(true);
    setSelectedConversation(null);
  };

  // Create new conversation with selected doctor
  const handleCreateConversation = async () => {
    if (!selectedDoctor || !user?.id) return;

    try {
      const conversation = await getOrCreateConversation(user.id, selectedDoctor.user_id);
      
      const newConv = {
        id: conversation.id,
        participant: {
          id: selectedDoctor.user_id,
          display_name: `Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name}`,
          avatar_url: selectedDoctor.profile_image_url,
          email: selectedDoctor.email
        },
        lastMessage: null,
        updatedAt: conversation.updated_at
      };

      setConversations(prev => [newConv, ...prev]);
      setSelectedConversation(newConv);

      // On mobile, show the message view
      if (isMobile) {
        setShowConversationsList(false);
      }

      setNewMessageModalOpen(false);
      setSelectedDoctor(null);
      setDoctorQuery("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.participant?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.content &&
        decryptMessage(conv.lastMessage.content)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.lastMessage && !conv.lastMessage.is_read && conv.lastMessage.recipient_id === user?.id) ||
      (filter === "urgent" && conv.lastMessage?.is_urgent);

    return matchesSearch && matchesFilter;
  });

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Mobile: Conversations List View */}
      {isMobile && showConversationsList && (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-3xl font-bold text-black">
                    Messages
                  </span>
                  <Shield className="w-5 h-5 text-green-600" title="End-to-end encrypted" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
                  Secure encrypted messaging
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Filter className="w-4 h-4" />}
                  onClick={() => setFilterOpen(!filterOpen)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  icon={
                    <Plus className="w-4 h-4 ml-2 sm:w-4 sm:h-4 text-center" />
                  }
                  onClick={() => setNewMessageModalOpen(true)}
                />
              </div>
            </div>

            {/* Search */}
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filterOpen && (
                <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm mt-2">
                  <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2">
                    {["all", "unread", "urgent"].map((filterOption) => (
                      <button
                        key={filterOption}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium capitalize ${
                          filter === filterOption
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => setFilter(filterOption)}
                      >
                        {filterOption}{" "}
                        {filterOption === "all" ? "Messages" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar
                      src={conversation.participant?.avatar_url || profile}
                      alt={conversation.participant?.display_name || "User"}
                      size="md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.participant?.display_name || conversation.participant?.email || "Unknown"}
                        </p>
                        <div className="flex items-center space-x-2">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.created_at)}
                            </span>
                          )}
                          {conversation.lastMessage && 
                           !conversation.lastMessage.is_read && 
                           conversation.lastMessage.recipient_id === user?.id && (
                            <span className="bg-red-600 text-white text-xs rounded-full w-2 h-2"></span>
                          )}
                        </div>
                      </div>

                      {conversation.lastMessage ? (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.sender_id === user?.id
                            ? "You: "
                            : ""}
                          {conversation.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic mt-1">
                          No messages yet
                        </p>
                      )}

                      {conversation.lastMessage?.is_urgent && (
                        <Badge
                          text="Urgent"
                          variant="danger"
                          size="small"
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-2">No conversations found</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setNewMessageModalOpen(true)}
                >
                  Start a conversation
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mobile: Message View */}
      {isMobile && !showConversationsList && selectedConversation && (
        <>
          {/* Message Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToConversations}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Avatar
                src={selectedConversation.participant?.avatar_url || profile}
                alt={selectedConversation.participant?.display_name || "User"}
                size="md"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {selectedConversation.participant?.display_name || selectedConversation.participant?.email}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {(messages[selectedConversation.id] || []).map((message) => {
              const isCurrentUser = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      {message.is_urgent && (
                        <Badge
                          text="Urgent"
                          variant="danger"
                          size="small"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div
                      className={`flex items-center mt-2 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-xs text-gray-500">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <div className="bg-white border-t border-gray-200 p-4 flex items-end">
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 bg-slate-50">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder="Type your message..."
                className="flex-1 text-sm text-gray-800 bg-transparent resize-none focus:outline-none leading-tight py-2"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    sendMessageHandler();
                  }
                }}
              />
            </div>

            <Button
              variant="primary"
              disabled={!newMessage.trim() || sendingMessage}
              onClick={sendMessageHandler}
              className="ml-1 px-3 py-2 h-[35px] rounded-md flex items-center justify-center space-x-1"
            >
              <Send className="w-4 h-5" />
              {sendingMessage && (
                <span className="hidden sm:inline">Sending...</span>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[30px] font-bold text-gray-900">
                    Messages
                  </span>
                  <Shield className="w-6 h-6 text-green-600" title="End-to-end encrypted" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Secure encrypted communication with doctors
                </p>
              </div>

              <div className="flex space-x-4">
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
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4 sm:w-4 sm:h-4 text-center" />}
                  onClick={() => setNewMessageModalOpen(true)}
                >
                  New Message
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filterOpen && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-4">
                    {["all", "unread", "urgent"].map((filterOption) => (
                      <button
                        key={filterOption}
                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                          filter === filterOption
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => setFilter(filterOption)}
                      >
                        {filterOption}{" "}
                        {filterOption === "all" ? "Messages" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conversations List */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Conversations ({filteredConversations.length})
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-red-50 border-red-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar
                          src={conversation.participant?.avatar_url || profile}
                          alt={conversation.participant?.display_name || "User"}
                          size="md"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-900 truncate">
                              {conversation.participant?.display_name || conversation.participant?.email}
                            </p>
                            <div className="flex items-center space-x-2">
                              {conversation.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(
                                    conversation.lastMessage.created_at
                                  )}
                                </span>
                              )}
                              {conversation.lastMessage && 
                               !conversation.lastMessage.is_read && 
                               conversation.lastMessage.recipient_id === user?.id && (
                                <span className="bg-red-600 text-white text-xs rounded-full w-2 h-2"></span>
                              )}
                            </div>
                          </div>

                          {conversation.lastMessage ? (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.sender_id ===
                              user?.id
                                ? "You: "
                                : ""}
                              {conversation.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic mt-1">
                              No messages yet
                            </p>
                          )}

                          {conversation.lastMessage?.is_urgent && (
                            <Badge
                              text="Urgent"
                              variant="danger"
                              size="small"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-gray-500 mt-2">No conversations found</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={() => setNewMessageModalOpen(true)}
                    >
                      Start a conversation
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Message View */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Message Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={selectedConversation.participant?.avatar_url || profile}
                          alt={selectedConversation.participant?.display_name || "User"}
                          size="md"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedConversation.participant?.display_name || selectedConversation.participant?.email}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span>End-to-end encrypted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {(messages[selectedConversation.id] || []).map(
                      (message) => {
                        const isCurrentUser =
                          message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="max-w-[65%]">
                              <div
                                className={`px-4 py-3 rounded-lg ${
                                  isCurrentUser
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                                {message.is_urgent && (
                                  <Badge
                                    text="Urgent"
                                    variant="danger"
                                    size="small"
                                    className="mt-2"
                                  />
                                )}
                              </div>
                              <div
                                className={`flex items-center mt-2 ${
                                  isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Bar */}
                  <div className="bg-white border-t border-gray-200 p-4 flex items-end">
                    <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 bg-slate-50">
                      <textarea
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        placeholder="Type your message..."
                        className="flex-1 text-sm text-gray-800 bg-transparent resize-none focus:outline-none leading-tight py-2"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            sendMessageHandler();
                          }
                        }}
                      />
                    </div>

                    <Button
                      variant="primary"
                      disabled={!newMessage.trim() || sendingMessage}
                      onClick={sendMessageHandler}
                      className="ml-3 px-3 py-2 h-[35px] rounded-md flex items-center justify-center"
                    >
                      {sendingMessage ? (
                        "Sending..."
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Choose a conversation from the list to view messages
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* New Message Modal */}
      <Modal
        isOpen={newMessageModalOpen}
        onClose={() => {
          setNewMessageModalOpen(false);
          setSelectedDoctor(null);
          setDoctorQuery("");
        }}
        title="New Message to Doctor"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select doctor</label>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctor by name or specialization..."
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {doctors
                .filter((d) => {
                  const q = doctorQuery.trim().toLowerCase();
                  if (!q) return true;
                  const name = `${d.first_name} ${d.last_name}`.toLowerCase();
                  const spec = (d.specialization || "").toLowerCase();
                  return name.includes(q) || spec.includes(q) || (d.email || "").toLowerCase().includes(q);
                })
                .map((doctor) => {
                  const isSelected = selectedDoctor?.id === doctor.id;
                  return (
                    <div
                      key={doctor.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedDoctor(doctor)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedDoctor(doctor);
                      }}
                      aria-pressed={isSelected}
                      className={`relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-shadow border ${isSelected ? 'bg-red-50 border-red-200 shadow-sm' : 'border-transparent hover:shadow-sm hover:bg-gray-50'}`}
                    >
                        <div className="flex-shrink-0 mr-3">
                          {isSelected ? (
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-gray-200 text-transparent">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <Avatar
                          src={doctor.profile_image_url || profile}
                          alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">Dr. {doctor.first_name} {doctor.last_name}</p>
                          <p className="text-sm text-gray-500 truncate">{doctor.specialization}</p>
                        </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setNewMessageModalOpen(false);
                setSelectedDoctor(null);
                setDoctorQuery("");
              }}
              className="w-full text-center sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleCreateConversation();
                setDoctorQuery("");
              }}
              disabled={!selectedDoctor}
              className="w-full text-center sm:w-auto"
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminMessagesNew;