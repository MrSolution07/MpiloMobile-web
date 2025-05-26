import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, MailOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDateTime } from '../../utils/dateUtils';

const RecentMessages = ({ messages }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
          Unread Messages
        </CardTitle>
        <Badge text={`${messages.length} new`} variant="primary" />
      </CardHeader>
      
      <CardContent className="flex-grow">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 3).map((message) => (
              <div 
                key={message.id} 
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <Avatar 
                  src={message.senderAvatar} 
                  alt={message.senderName} 
                  size="sm" 
                  className="flex-shrink-0 mr-3"
                />
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.senderName}
                    </p>
                    <p className="text-xs text-gray-500 ml-2">
                      {formatDateTime(message.timestamp)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                    {message.content}
                  </p>
                </div>
                
                {message.urgent && (
                  <Badge text="Urgent" variant="danger" size="small" className="ml-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <MailOpen className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No unread messages</p>
            <p className="text-xs text-gray-500">You're all caught up!</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center text-purple-600 hover:text-purple-800"
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
        >
          <Link to="/messages">View all messages</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentMessages;