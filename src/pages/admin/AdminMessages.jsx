import MessagesList from "../../components/messages/MessagesList";

const Messages = () => {
  return (
    <div className="flex h-[calc(100vh-2rem)] bg-gray-50 rounded-lg overflow-hidden">
      <div className="p-4">
        <MessagesList />
      </div>
    </div>
  );
};

export default Messages;
