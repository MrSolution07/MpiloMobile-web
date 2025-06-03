import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical } from 'lucide-react';

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent hover:bg-gray-100',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Avatar = ({ children, className = '' }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 ${className}`}>
    <span className="text-sm font-medium leading-none text-gray-600">{children}</span>
  </div>
);

// Main Component
const ChatConversation = ({ conversation, onSendMessage, currentUser = 'You' }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {conversation.participant.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.participant}</h2>
            <p className="text-sm text-gray-500">{conversation.role}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.sender === currentUser ? 'order-2' : 'order-1'}`}>
              {message.sender !== currentUser && (
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">{message.sender}</span>
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === currentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <p className={`text-xs mt-1 ${
                message.sender === currentUser ? 'text-right text-gray-400' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatConversation;
