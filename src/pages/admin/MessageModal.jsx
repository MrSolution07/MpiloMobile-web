import { X } from "lucide-react";
import { MessagesAvatar, Button, contacts } from "./MessagesAvatar";

const MessageModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button
            variant="ghost"
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

const NewMessageModal = ({ 
  isOpen, 
  onClose, 
  selectedContacts, 
  setSelectedContacts, 
  onCreateConversation 
}) => {
  return (
    <MessageModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedContacts([]);
      }}
      title="New Message"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select recipient
          </label>
          <div className="space-y-2 max-h-48 md:max-h-60 overflow-y-auto">
            {contacts.map((contact) => (
              <label key={contact.id} className="flex items-center space-x-2 md:space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
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
                <MessagesAvatar src={contact.avatar} alt={contact.name} size="sm" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.role}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              setSelectedContacts([]);
            }}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCreateConversation}
            disabled={selectedContacts.length === 0}
            size="sm"
          >
            Start Conversation
          </Button>
        </div>
      </div>
    </MessageModal>
  );
};

export { MessageModal, NewMessageModal };
export default MessageModal;