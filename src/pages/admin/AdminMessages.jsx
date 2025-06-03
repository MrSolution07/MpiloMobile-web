//css needs some work, it clashes with the predefined styles.... will fix later


import { useState } from 'react';
import ConversationSidebar from '../../components/layout/admin/ConversationSidebar';
import ChatConversation from '../../components/layout/admin/ChatConversation';

const Messages = () => {
  const initialConversations = [
    {
      id: 1,
      participant: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      messages: [
        {
          id: 1,
          sender: 'Dr. Sarah Johnson',
          content: 'Hello! I wanted to follow up on your patient John Doe. His latest test results look concerning.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 2,
          sender: 'You',
          content: 'Thank you for reaching out. What specific concerns do you have?',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 3,
          sender: 'Dr. Sarah Johnson',
          content: 'His cholesterol levels are significantly elevated. I recommend scheduling a consultation this week.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        }
      ]
    },
    {
      id: 2,
      participant: 'Dr. Michael Brown',
      role: 'General Practitioner',
      messages: [
        {
          id: 4,
          sender: 'Dr. Michael Brown',
          content: 'Hi there! My afternoon schedule has been updated. Could you please check the availability for patient consultations?',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: 5,
          sender: 'You',
          content: 'Sure, I\'ll review the schedule and get back to you shortly.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]
    },
    {
      id: 3,
      participant: 'Admin Team',
      role: 'System Administrator',
      messages: [
        {
          id: 6,
          sender: 'Admin Team',
          content: 'Scheduled maintenance will occur this weekend from 2-4 AM. Please ensure all critical data is backed up.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]
    },
    {
      id: 4,
      participant: 'Dr. Emily Davis',
      role: 'Pediatrician',
      messages: [
        {
          id: 7,
          sender: 'Dr. Emily Davis',
          content: 'Good morning! I have a question about the new vaccination protocols.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          read: false
        }
      ]
    }
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    
    // Mark messages as read when conversation is opened
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const handleSendMessage = (conversationId, content) => {
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      content,
      timestamp: new Date().toISOString(),
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-gray-50 rounded-lg overflow-hidden">
      <ConversationSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ChatConversation
        conversation={selectedConversation}
        onSendMessage={handleSendMessage}
        currentUser="You"
      />
    </div>
  );
};

export default Messages;