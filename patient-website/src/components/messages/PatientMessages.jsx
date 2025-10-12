import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  Mail,
  X,
  Send,
  ArrowLeft,
  Video,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context";
import { supabase } from "../../services/supabaseClient";
import {
  getUserConversations,
  getConversationMessages,
  sendMessage as sendMessageAPI,
  markMessagesAsRead,
  getOrCreateConversation,
  getAdminUser,
  getAllDoctors,
  subscribeToMessages,
  decryptMessage,
  subscribeToConversations,
} from "@/services";
import profile from "../../../public/assets/images/profileImg.png";
import { CallButton } from "@/components/video-call";

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

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button
            variant="secondary"
            size="sm"
            icon={<X className="w-4 h-4" />}
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

function PatientMessages() {
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
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [contactSearchQuery, setContactSearchQuery] = useState("");

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

  // Get current patient ID from user
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!user?.id) return;
      
      try {
        console.log('👤 Fetching patient ID for user:', user.id);
        const { data, error } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('❌ Error fetching patient ID:', error);
          return;
        }
        
        if (data) {
          console.log('✅ Patient ID found:', data.id);
          setCurrentPatientId(data.id);
        } else {
          console.log('⚠️ No patient record found for user');
        }
      } catch (error) {
        console.error("Error fetching patient ID:", error);
      }
    };

    fetchPatientId();
  }, [user]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Load conversations with their latest messages
        const convs = await getUserConversations(user.id);
        setConversations(convs);
        
        // Load contacts (admin + doctors)
        const contactsList = [];
        
        // Get admin
        console.log('Loading contacts...');
        const admin = await getAdminUser();
        if (admin) {
          console.log('Admin found:', admin.display_name || admin.email);
          contactsList.push({
            id: admin.id,
            display_name: admin.display_name || 'Admin',
            avatar_url: admin.avatar_url,
            email: admin.email,
            type: 'admin'
          });
        }
        
        // Get all doctors
        console.log('Fetching all doctors...');
        const allDoctors = await getAllDoctors();
        console.log('Doctors found:', allDoctors.length);
        
        allDoctors.forEach(doctor => {
          contactsList.push({
            id: doctor.user_id,
            display_name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
            avatar_url: doctor.profile_image_url,
            email: doctor.email,
            type: 'doctor',
            specialization: doctor.specialization
          });
        });
        
        console.log('Total contacts loaded:', contactsList.length);
        setContacts(contactsList);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, currentPatientId]);

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
            console.log('📨 New message received via subscription:', newMsg.id);
            
            // Prevent duplicates - check if message already exists
            setMessages(prev => {
              const existing = prev[selectedConversation.id] || [];
              
              // Check for duplicate by ID or by temp ID replacement
              const messageExists = existing.some(msg => 
                msg.id === newMsg.id || 
                (msg.id.startsWith('temp-') && msg.content === newMsg.content && 
                 Math.abs(new Date(msg.created_at) - new Date(newMsg.created_at)) < 2000)
              );
              
              if (messageExists) {
                console.log('✋ Message already exists, skipping duplicate');
                return prev;
              }
              
              console.log('✅ Adding new message to state');
              return {
                ...prev,
                [selectedConversation.id]: [...existing, newMsg]
              };
            });

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

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
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
      const sentMessage = await sendMessageAPI({
        conversationId: selectedConversation.id,
        senderId: user.id,
        recipientId: selectedConversation.participant.id,
        content: messageContent,
        urgent: false,
      });

      // Replace temp message with real one
      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: (prev[selectedConversation.id] || []).map(msg =>
          msg.id === tempId ? { ...sentMessage, content: messageContent } : msg
        ),
      }));

      // Refresh conversations to update last message
      await refreshConversations();
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove failed message
      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].filter(
          (msg) => msg.id !== tempId
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

  // Create new conversation with selected contact
  const handleCreateConversation = async () => {
    if (!selectedRecipient || !user?.id) return;

    try {
      const conversation = await getOrCreateConversation(user.id, selectedRecipient.id);
      
      const newConv = {
        id: conversation.id,
        participant: selectedRecipient,
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
      setSelectedRecipient(null);
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
            <div className="flex items-center justify-between">
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
              <CallButton calleeId={selectedConversation.participant?.id}>
                <Video className="size-5" />
              </CallButton>
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
                  Secure encrypted communication
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
                      <CallButton calleeId={selectedConversation.participant?.id}>
                        <Video className="size-5" />
                      </CallButton>
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
          setSelectedRecipient(null);
          setContactSearchQuery("");
        }}
        title="New Message"
      >
        <div className="space-y-4">
          {/* Contact Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Contacts
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Recipients List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipient ({contacts.filter((contact) => {
                const searchLower = contactSearchQuery.toLowerCase();
                return (
                  contact.display_name.toLowerCase().includes(searchLower) ||
                  contact.email?.toLowerCase().includes(searchLower) ||
                  contact.type.toLowerCase().includes(searchLower)
                );
              }).length} {contacts.length !== contacts.filter((contact) => {
                const searchLower = contactSearchQuery.toLowerCase();
                return (
                  contact.display_name.toLowerCase().includes(searchLower) ||
                  contact.email?.toLowerCase().includes(searchLower) ||
                  contact.type.toLowerCase().includes(searchLower)
                );
              }).length ? `of ${contacts.length}` : ''})
            </label>
            <div className="space-y-1 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
              {contacts
                .filter((contact) => {
                  const searchLower = contactSearchQuery.toLowerCase();
                  return (
                    contact.display_name.toLowerCase().includes(searchLower) ||
                    contact.email?.toLowerCase().includes(searchLower) ||
                    contact.type.toLowerCase().includes(searchLower)
                  );
                })
                .map((contact) => (
                  <label
                    key={contact.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all min-h-[72px] ${
                      selectedRecipient?.id === contact.id
                        ? "bg-red-50 border-2 border-red-300"
                        : "bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipient"
                      checked={selectedRecipient?.id === contact.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecipient(contact);
                        }
                      }}
                      className="w-4 h-4 border-gray-300 text-red-600 focus:ring-red-500 flex-shrink-0"
                    />
                    <Avatar 
                      src={contact.avatar_url || profile} 
                      alt={contact.display_name} 
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{contact.display_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {contact.email}
                          {contact.specialization && ` • ${contact.specialization}`}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          contact.type === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : contact.type === 'doctor'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {contact.type}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              
              {contacts.filter((contact) => {
                const searchLower = contactSearchQuery.toLowerCase();
                return (
                  contact.display_name.toLowerCase().includes(searchLower) ||
                  contact.email?.toLowerCase().includes(searchLower) ||
                  contact.type.toLowerCase().includes(searchLower)
                );
              }).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No contacts found</p>
                  {contactSearchQuery && (
                    <button
                      onClick={() => setContactSearchQuery("")}
                      className="text-red-600 text-sm mt-2 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Cancel on left, Start on right */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                setNewMessageModalOpen(false);
                setSelectedRecipient(null);
                setContactSearchQuery("");
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateConversation}
              disabled={!selectedRecipient}
              className="px-6"
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PatientMessages;
