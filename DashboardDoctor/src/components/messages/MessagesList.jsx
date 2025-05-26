import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertCircle, 
  Search, 
  Plus, 
  ChevronDown, 
  Filter,
  Mail,
  Clock
} from 'lucide-react';
import { mockMessages, mockPatients, currentUser } from '../../data/mockData';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDateTime } from '../../utils/dateUtils';

const MessagesList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'urgent'
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter messages
  const filteredMessages = mockMessages.filter(message => {
    // Only show messages to/from current user
    const isRelevantToUser = message.recipientId === currentUser.id || message.senderId === currentUser.id;
    
    // Apply search filter
    const matchesSearch = 
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !message.read && message.recipientId === currentUser.id) || 
      (filter === 'urgent' && message.urgent);
    
    return isRelevantToUser && matchesSearch && matchesFilter;
  });
  
  // Sort messages by date (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Communicate with patients and colleagues
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            size="sm"
            icon={<Filter className="h-4 w-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>
          
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus className="h-4 w-4" />}
          >
            New Message
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filterOpen && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All Messages
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'unread' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'urgent' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('urgent')}
              >
                Urgent
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Messages List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                Messages ({sortedMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-300px)]">
              {sortedMessages.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sortedMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`
                        flex items-start p-4 cursor-pointer transition-colors
                        ${selectedMessage?.id === message.id ? 'bg-blue-50' : 'hover:bg-gray-50'} 
                        ${!message.read && message.recipientId === currentUser.id ? 'bg-blue-50' : ''}
                      `}
                      onClick={() => handleMessageSelect(message)}
                    >
                      <Avatar 
                        src={message.senderAvatar} 
                        alt={message.senderName} 
                        size="md" 
                        className="flex-shrink-0 mr-3"
                      />
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!message.read && message.recipientId === currentUser.id ? 'text-blue-800' : 'text-gray-900'} truncate`}>
                            {message.senderName}
                          </p>
                          <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {formatDateTime(message.timestamp).split(',')[0]}
                          </p>
                        </div>
                        <p className={`text-xs ${!message.read && message.recipientId === currentUser.id ? 'text-blue-700 font-medium' : 'text-gray-700'} mt-1 line-clamp-2`}>
                          {message.content}
                        </p>
                        <div className="flex items-center mt-1">
                          {message.urgent && (
                            <Badge text="Urgent" variant="danger" size="small" />
                          )}
                          {!message.read && message.recipientId === currentUser.id && (
                            <span className="ml-auto inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Mail className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm font-medium text-gray-900">No messages found</p>
                  <p className="text-xs text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Message Detail View */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedMessage ? (
              <>
                <CardHeader className="border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar 
                        src={selectedMessage.senderAvatar} 
                        alt={selectedMessage.senderName} 
                        size="md" 
                        className="mr-3"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedMessage.senderName}</h3>
                        <p className="text-sm text-gray-500">{formatDateTime(selectedMessage.timestamp)}</p>
                      </div>
                    </div>
                    {selectedMessage.urgent && (
                      <Badge text="Urgent" variant="danger" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-100 pt-4">
                    <div className="flex space-x-2 mt-4">
                      <Button variant="primary">Reply</Button>
                      <Button variant="secondary">Forward</Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-6">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a message</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a message from the list to view its contents
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;