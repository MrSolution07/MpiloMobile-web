import { Search, Plus, Filter } from "lucide-react";
import { Button } from "./MessagesAvatar";

// Header with Search and Filter Component
const MessagesHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  filterOpen, 
  setFilterOpen, 
  onNewMessage 
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-3xl sm:text-3xl font-bold text-black">Messages</span>
            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
              Professional communication portal
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onNewMessage}
            className="w-full align-center justify-center sm:w-auto"
          >
            <span className="mr-2">New Message</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 md:px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-8 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Bar */}
      {filterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm mx-4 md:mx-6 mb-4">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {['all', 'unread', 'urgent'].map((filterOption) => (
              <button
                key={filterOption}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm font-medium capitalize ${
                  filter === filterOption
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setFilter(filterOption)}
              >
                {filterOption} {filterOption === 'all' ? 'Messages' : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesHeader;