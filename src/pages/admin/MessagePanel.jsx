import { MessageSquare, Mail, ArrowLeft } from "lucide-react";
import { MessagesAvatar, Badge, Button, currentUser } from "./MessagesAvatar";

const MessagePanel = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  sendingMessage,
  showConversations,
  setShowConversations,
  messagesEndRef
}) => {

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

  // Handle back to conversations (mobile)
  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  // Conversation Item Component
  const ConversationItem = ({ conversation, isSelected, onClick }) => (
    <div
      className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected
          ? "bg-red-50 border-red-200"
          : "hover:bg-gray-50 active:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-2 md:space-x-3">
        <MessagesAvatar
          src={conversation.participantAvatar}
          alt={conversation.participantName}
          size="md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
              {conversation.participantName}
            </p>
            <div className="flex items-center space-x-1 md:space-x-2">
              {conversation.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.lastMessage.timestamp)}
                </span>
              )}
              {conversation.unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 md:px-2 md:py-1 min-w-[18px] md:min-w-[20px] text-center">
                  {conversation.unreadCount}
                </span>
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
            <div className="mt-2">
              <Badge text="Urgent" variant="danger" size="small" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Message Item Component
  const MessageItem = ({ message, isCurrentUser }) => (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-[85%] md:max-w-2xl">
        <div className={`px-3 py-2 md:px-4 md:py-3 rounded-lg ${
          isCurrentUser 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          {message.urgent && (
            <div className="mt-2">
              <Badge text="Urgent" variant="danger" size="small" />
            </div>
          )}
        </div>
        
        <div className={`flex items-center mt-1 md:mt-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className={`
        ${showConversations ? 'flex' : 'hidden'} 
        lg:flex lg:w-1/3 w-full bg-white border-r border-gray-200 flex-col
      `}>
        <div className="p-3 md:p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-sm md:text-base">
            Conversations ({conversations.length})
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => onConversationSelect(conversation)}
              />
            ))
          ) : (
            <div className="p-6 md:p-8 text-center">
              <Mail className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-2 text-sm md:text-base">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Message View */}
      <div className={`
        flex-1 flex flex-col
        ${!showConversations ? 'flex' : 'hidden'} 
        lg:flex
      `}>
        {selectedConversation ? (
          <>
          
            {/* Message Header */}
            <div className="bg-white border-b border-gray-200 p-3 md:p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowLeft className="w-4 h-4 " />}
                    onClick={handleBackToConversations}
                    className="lg:hidden"
                  />
                  <MessagesAvatar
                    src={selectedConversation.participantAvatar}
                    alt={selectedConversation.participantName}
                    size="sm"
                  />
                  <div>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      {selectedConversation.participantName}
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6">
              {(messages[selectedConversation.id] || []).map((message) => {
                const isCurrentUser = message.senderId === currentUser.id;
                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>


            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 md:p-6">
              <div className="flex space-x-2 md:space-x-3 items-end">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  variant="primary"
                  disabled={!newMessage.trim() || sendingMessage}
                  onClick={sendMessage}
                  size="default"
                  className="px-4 md:px-6"
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-4">
                Select a conversation
              </h3>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Choose a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;