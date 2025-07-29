import { useState } from "react";
import { MessageSquare, Search, Plus, Filter, Mail } from "lucide-react";
import { mockMessages, currentUser } from "../../data";
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

function MessagesList() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'urgent'
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Filter messages
  const filteredMessages = mockMessages.filter((message) => {
    // Only show messages to/from current user
    const isRelevantToUser =
      message.recipientId === currentUser.id ||
      message.senderId === currentUser.id;

    // Apply search filter
    const matchesSearch =
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" &&
        !message.read &&
        message.recipientId === currentUser.id) ||
      (filter === "urgent" && message.urgent);

    return isRelevantToUser && matchesSearch && matchesFilter;
  });

  // Sort messages by date (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
  };

  const handleReplyClick = () => {
    setReplyOpen(true);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Replace this with actual send logic
      console.log("Reply sent:", replyText, "to", selectedMessage);
      setReplyText("");
      setReplyOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">Messages</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Communicate with patients and colleagues
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            New Message
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                All Messages
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "unread"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === "urgent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("urgent")}
              >
                Urgent
              </button>
            </div>
          </div>
        )}
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
              {sortedMessages.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sortedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`
                        flex items-start p-4 cursor-pointer transition-colors
                        ${
                          selectedMessage?.id === message.id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }
                        ${
                          !message.read &&
                          message.recipientId === currentUser.id
                            ? "bg-blue-50"
                            : ""
                        }
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
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-sm font-medium ${
                              !message.read &&
                              message.recipientId === currentUser.id
                                ? "text-blue-800"
                                : "text-gray-900"
                            } truncate`}
                          >
                            {message.senderName}
                          </p>
                          <p className="ml-2 text-gray-500 text-xs whitespace-nowrap">
                            {formatDateTime(message.timestamp).split(",")[0]}
                          </p>
                        </div>
                        <p
                          className={`text-xs ${
                            !message.read &&
                            message.recipientId === currentUser.id
                              ? "text-blue-700 font-medium"
                              : "text-gray-700"
                          } mt-1 line-clamp-2`}
                        >
                          {message.content}
                        </p>
                        <div className="flex items-center mt-1">
                          {message.urgent && (
                            <Badge
                              text="Urgent"
                              variant="danger"
                              size="small"
                            />
                          )}
                          {!message.read &&
                            message.recipientId === currentUser.id && (
                              <span className="inline-block bg-blue-600 ml-auto rounded-full w-2 h-2"></span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Mail className="mx-auto w-10 h-10 text-gray-300" />
                  <p className="mt-2 font-medium text-gray-900 text-sm">
                    No messages found
                  </p>
                  <p className="text-gray-500 text-xs">
                    Try adjusting your search or filter criteria
                  </p>
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
                <CardHeader className="border-gray-100 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar
                        src={selectedMessage.senderAvatar}
                        alt={selectedMessage.senderName}
                        size="md"
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">
                          {selectedMessage.senderName}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {formatDateTime(selectedMessage.timestamp)}
                        </p>
                      </div>
                    </div>
                    {selectedMessage.urgent && (
                      <Badge text="Urgent" variant="danger" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-none prose">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-gray-100 border-t">
                    {!replyOpen ? (
                      <div className="flex space-x-2 mt-4">
                        <Button variant="primary" onClick={handleReplyClick}>
                          Reply
                        </Button>
                      </div>
                    ) : (
                      <form
                        className="flex flex-col space-y-3 mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendReply();
                        }}
                      >
                        <textarea
                          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={!replyText.trim()}
                          >
                            Send
                          </Button>
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                              setReplyOpen(false);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex justify-center items-center p-6 h-full">
                <div className="text-center">
                  <MessageSquare className="mx-auto w-12 h-12 text-gray-300" />
                  <h3 className="mt-2 font-medium text-gray-900 text-lg">
                    Select a message
                  </h3>
                  <p className="mt-1 text-gray-500 text-sm">
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
}

export default MessagesList;
