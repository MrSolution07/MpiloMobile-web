import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, MailOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Avatar,
  Badge,
} from "../ui";
import { formatDateTime } from "../../utils";

const RecentMessages = ({ messages }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="flex items-center font-semibold text-gray-900 text-lg">
          <MessageSquare className="mr-2 w-5 h-5 text-[#274D60]" />
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
                className="flex items-start hover:bg-gray-50 p-3 border border-gray-100 rounded-lg transition-colors"
              >
                <Avatar
                  src={message.senderAvatar}
                  alt={message.senderName}
                  size="sm"
                  className="flex-shrink-0 mr-3"
                />

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {message.senderName}
                    </p>
                    <p className="ml-2 text-gray-500 text-xs">
                      {formatDateTime(message.timestamp)}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-700 text-xs line-clamp-2">
                    {message.content}
                  </p>
                </div>

                {message.urgent && (
                  <Badge
                    text="Urgent"
                    variant="danger"
                    size="small"
                    className="ml-2"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <MailOpen className="mx-auto w-10 h-10 text-gray-300" />
            <p className="mt-2 font-medium text-gray-900 text-sm">
              No unread messages
            </p>
            <p className="text-gray-500 text-xs">You're all caught up!</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="justify-center w-full text-[#274D60]hover:text-purple-800"
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          <Link to="/dashboard/messages">View all messages</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentMessages;
