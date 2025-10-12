import { X, Search } from "lucide-react";
import { useState } from "react";
import { MessagesAvatar, Button, contacts } from "./MessagesAvatar";

const MessageModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
        {/* Top centered close */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4 text-red-600" />}
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center w-9 h-9"
            aria-label="Close modal"
          />
        </div>

        <div className="mt-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">{title}</h3>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

const NewMessageModal = ({
  isOpen,
  onClose,
  selectedContacts,
  setSelectedContacts,
  onCreateConversation,
}) => {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filtered = contacts.filter((c) => {
    if (!q) return true;
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.role || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <MessageModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedContacts([]);
        setQuery("");
      }}
      title="New Message"
    >
      <div className="space-y-4">
        {/* Contact Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Contacts
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Recipients List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Recipient ({filtered.length} {filtered.length === 1 ? 'contact' : 'contacts'})
          </label>
          <div className="space-y-1 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
            {filtered.map((contact) => {
              const sel = selectedContacts.includes(contact.id);
              return (
                <label
                  key={contact.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all min-h-[72px] ${
                    sel
                      ? "bg-red-50 border-2 border-red-300"
                      : "bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="recipient"
                    checked={sel}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([contact.id]);
                      }
                    }}
                    className="w-4 h-4 border-gray-300 text-red-600 focus:ring-red-500 flex-shrink-0"
                  />
                  <MessagesAvatar 
                    src={contact.avatar} 
                    alt={contact.name} 
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {contact.email || contact.role}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        contact.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : contact.role === 'Doctor' || contact.role === 'Colleague'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {contact.role}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No contacts found</p>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-red-600 text-sm mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Cancel on left, Start on right */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              setSelectedContacts([]);
              setQuery("");
            }}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onCreateConversation();
              setQuery("");
            }}
            disabled={selectedContacts.length === 0}
            className="px-6"
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