import { useEffect, useState } from "react";
import { MessageSquare, Search, Plus, Filter, Mail } from "lucide-react";
import { mockMessages as fetchMessages, currentUser } from "../../data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Avatar,
} from "../ui";
import { formatDateTime } from "../../utils";
import { useAuth } from "../../context";


// Mock current user - replace with actual auth
const currentUser = {
  id: "user-1",
  name: "Dr. Sarah Johnson",
  avatar: "https://www.gravatar.com/avatar/?d=mp"
};

  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function loadData() {
      setLoading(true);

      try {
        const data = await fetchMessages(user.id);
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    // Only show messages to/from current user
    const isRelevantToUser =
      message?.recipient_id === user.id || message?.sender_id === user.id;

    // Apply search filter
    const matchesSearch =
      message?.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message?.content?.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" &&
        !message?.read &&
        message?.recipient_id === user.id) ||
      (filter === "urgent" && message?.urgent);

    return isRelevantToUser && matchesSearch && matchesFilter;
  });


  return (
    <div className={`relative ${className}`}>
      <img
        src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=ef4444&color=fff`}
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
    warning: "bg-yellow-100 text-yellow-800"
  };
  
  const sizes = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm"
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {text}
    </span>
  );
};

// Button component
const Button = ({ children, variant = "default", size = "default", icon, onClick, disabled, className = "", loading = false }) => {
  const variants = {
    default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    primary: "bg-red-600 text-white border-transparent hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200",
    danger: "bg-red-600 text-white border-transparent hover:bg-red-700"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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

function MessagesList() {
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
  const [selectedContacts, setSelectedContacts] = useState([]);
  
  // Refs
  const messagesEndRef = useRef(null);

  // Sample contacts for new message modal
  const contacts = [
    {
      id: "user-2",
      name: "John Smith",
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      role: "Patient"
    },
    {
      id: "user-3", 
      name: "Dr. Mike Wilson",
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      role: "Colleague"
    },
    {
      id: "user-4",
      name: "Sarah Davis",
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      role: "Patient"
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    // Sample conversations
    const sampleConversations = [
      {
        id: "conv-1",
        participantId: "user-2",
        participantName: "John Smith",
        participantAvatar: "https://www.gravatar.com/avatar/?d=mp",
        lastMessage: {
          id: "msg-1",
          senderId: "user-2",
          senderName: "John Smith",
          content: "Hi Dr. Johnson, I have a question about my recent test results.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          read: false,
          urgent: false
        },
        unreadCount: 1
      },
      {
        id: "conv-2",
        participantId: "user-3",
        participantName: "Dr. Mike Wilson",
        participantAvatar: "https://www.gravatar.com/avatar/?d=mp",
        lastMessage: {
          id: "msg-2",
          senderId: "user-3",
          senderName: "Dr. Mike Wilson", 
          content: "Can we discuss the patient case we talked about yesterday?",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          read: true,
          urgent: false
        },
        unreadCount: 0
      }
    ];

    setConversations(sampleConversations);

    // Sample messages
    const sampleMessages = {
      "conv-1": [
        {
          id: "msg-1",
          conversationId: "conv-1",
          senderId: "user-2",
          senderName: "John Smith",
          content: "Hi Dr. Johnson, I have a question about my recent test results.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          read: false,
          urgent: false
        }
      ],
      "conv-2": [
        {
          id: "msg-2",
          conversationId: "conv-2",
          senderId: "user-3",
          senderName: "Dr. Mike Wilson",
          content: "Can we discuss the patient case we talked about yesterday?",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          read: true,
          urgent: false
        },
        {
          id: "msg-3",
          conversationId: "conv-2",
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: "Of course! I'm available this afternoon. What specific aspects would you like to discuss?",
          timestamp: new Date(Date.now() - 580000).toISOString(),
          read: true,
          urgent: false
        }
      ]
    };

    setMessages(sampleMessages);
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation, scrollToBottom]);

  // Fetch messages function - replace with your API call
  const fetchMessages = async (conversationId) => {
    try {
      // This is where you'd make your actual API call
      // const response = await fetch(`/api/conversations/${conversationId}/messages`);
      // const newMessages = await response.json();
      
      console.log("Fetching messages for conversation:", conversationId);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message function - replace with your API call
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);

    const messageData = {
      conversationId: selectedConversation.id,
      recipientId: selectedConversation.participantId,
      content: newMessage.trim(),
      urgent: false
    };

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      urgent: false
    };

    // Add message optimistically
    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), optimisticMessage]
    }));

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: optimisticMessage }
          : conv
      )
    );

    setNewMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where you'd make your actual API call
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(messageData)
      // });
      // const sentMessage = await response.json();

      console.log("Message sent successfully");

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove failed message
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].filter(msg => msg.id !== optimisticMessage.id)
      }));
      
      // Restore message to input
      setNewMessage(messageData.content);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = useCallback((conversation) => {
    setSelectedConversation(conversation);
    
    // Mark messages as read
    if (conversation.unreadCount > 0) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        )
      );
      
      setMessages(prev => ({
        ...prev,
        [conversation.id]: (prev[conversation.id] || []).map(msg =>
          msg.senderId !== currentUser.id ? { ...msg, read: true } : msg
        )
      }));
    }

    // Fetch latest messages when conversation is selected
    fetchMessages(conversation.id);
  }, []);

  // Create new conversation
  const handleCreateConversation = useCallback(() => {
    if (selectedContacts.length === 0) return;

    const conversationId = `conv-${Date.now()}`;
    const contact = contacts.find(c => c.id === selectedContacts[0]);
    
    const newConversation = {
      id: conversationId,
      participantId: selectedContacts[0],
      participantName: contact.name,
      participantAvatar: contact.avatar,
      lastMessage: null,
      unreadCount: 0
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setNewMessageModalOpen(false);
    setSelectedContacts([]);
  }, [selectedContacts, contacts]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === "all" || 
                         (filter === "unread" && conv.unreadCount > 0) ||
                         (filter === "urgent" && conv.lastMessage?.urgent);

    return matchesSearch && matchesFilter;
  });

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              Professional communication portal
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
              icon={<Plus className="w-4 h-4" />}
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
                {['all', 'unread', 'urgent'].map((filterOption) => (
                  <button
                    key={filterOption}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                      filter === filterOption
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter(filterOption)}
                  >
                    {filterOption} {filterOption === 'all' ? 'Messages' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages List and Detail View */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="border-gray-100 border-b">
              <CardTitle className="flex items-center font-medium text-gray-900 text-lg">
                <MessageSquare className="mr-2 w-5 h-5 text-blue-600" />
                Messages ({sortedMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[calc(100vh-300px)] overflow-y-auto">
              {loading ? (
                <p className="p-4 text-gray-500 text-sm">Loading messages...</p>
              ) : sortedMessages.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sortedMessages.map((message) => (
                    <div
                      key={message?.id}
                      className={`
                        flex items-start p-4 cursor-pointer transition-colors
                        ${
                          selectedMessage?.id === message?.id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }
                        ${
                          !message?.read && message?.recipient_id === user.id
                            ? "bg-blue-50"
                            : ""
                        }
                      `}
                      onClick={() => handleMessageSelect(message)}
                    >
                      <Avatar
                        // src={message?.sender_avatar}
                        alt={message?.sender_name || "anon"}
                        size="md"
                        className="flex-shrink-0 mr-3"
                      />

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-sm font-medium ${
                              !message?.read &&
                              message?.recipient_id === user.id
                                ? "text-blue-800"
                                : "text-gray-900"
                            } truncate`}
                          >
                            {message?.sender_name}
                          </p>
                          <p className="ml-2 text-gray-500 text-xs whitespace-nowrap">
                            {formatDateTime(message?.timestamp)?.split(",")[0]}
                          </p>
                        </div>
                        <p
                          className={`text-xs ${
                            !message?.read && message?.recipient_id === user.id
                              ? "text-blue-700 font-medium"
                              : "text-gray-700"
                          } mt-1 line-clamp-2`}
                        >
                          {message?.content}
                        </p>
                        <div className="flex items-center mt-1">
                          {message?.urgent && (
                            <Badge
                              text="Urgent"
                              variant="danger"
                              size="small"
                            />
                          )}
                          {!message?.read &&
                            message?.recipient_id === user.id && (
                              <span className="inline-block bg-blue-600 ml-auto rounded-full w-2 h-2"></span>
                            )}

                        </div>
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage.senderId === currentUser.id ? "You: " : ""}
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      {conversation.lastMessage?.urgent && (
                        <Badge text="Urgent" variant="danger" size="small" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-2">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-gray-100 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar
                        // src={selectedMessage?.sender_avatar}
                        alt={selectedMessage?.sender_name || "anon"}
                        size="md"
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">
                          {selectedMessage?.sender_name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {formatDateTime(selectedMessage?.timestamp)}
                        </p>
                      </div>
                    </div>
                    {selectedMessage?.urgent && (
                      <Badge text="Urgent" variant="danger" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-none prose">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedMessage?.content}
                    </p>

                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(messages[selectedConversation.id] || []).map((message) => {
                  const isCurrentUser = message.senderId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-2xl">
                        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.urgent && (
                            <Badge text="Urgent" variant="danger" size="small" className="mt-2" />
                          )}
                        </div>
                        
                        <div className={`flex items-center mt-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                         
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-6">
                <div className="flex space-x-3 items-end">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 h-[40px] resize-none leading-tight align-middle"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '40px', resize: 'none' }}
                    onKeyDown={(e) => {
                      // Allow Enter for newline, Ctrl+Enter or Cmd+Enter to send
                      if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    disabled={!newMessage.trim() || sendingMessage}
                    onClick={sendMessage}
                    className="px-6 py-3 h-[40px] flex items-center justify-center ml-3"
                  >
                    {sendingMessage ? "Sending..." : "Send"}
                  </Button>
                </div>
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

      {/* New Message Modal */}
      <Modal
        isOpen={newMessageModalOpen}
        onClose={() => {
          setNewMessageModalOpen(false);
          setSelectedContacts([]);
        }}
        title="New Message"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select recipient
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {contacts.map((contact) => (
                <label key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="recipient"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([contact.id]);
                      }
                    }}
                    className="border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <Avatar src={contact.avatar} alt={contact.name} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setNewMessageModalOpen(false);
                setSelectedContacts([]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateConversation}
              disabled={selectedContacts.length === 0}
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MessagesList;