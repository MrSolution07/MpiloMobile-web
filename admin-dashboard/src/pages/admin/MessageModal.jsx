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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select recipient</label>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Search recipients"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 md:max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-6 text-sm text-gray-500">No contacts found</div>
            ) : (
              filtered.map((contact) => {
                const sel = selectedContacts.includes(contact.id);
                return (
                  <div
                    key={contact.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedContacts([contact.id])}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedContacts([contact.id]);
                    }}
                    aria-pressed={sel}
                    className={`relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-shadow border ${sel ? 'bg-red-50 border-red-200 shadow-sm' : 'border-transparent hover:shadow-sm hover:bg-gray-50'}`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {sel ? (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-gray-200 text-transparent">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </span>
                      )}
                    </div>

                    <MessagesAvatar src={contact.avatar} alt={contact.name} size="md" />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-sm text-gray-500 truncate">{contact.role}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              setSelectedContacts([]);
              setQuery("");
            }}
            className="w-full text-center sm:w-auto"
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
            className="w-full text-center sm:w-auto"
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