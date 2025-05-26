import React, { useState } from 'react';
import { Calendar, Clock, Filter, ChevronDown, Search, Plus } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { 
  mockAppointments, 
  mockPatients 
} from '../../data/mockData';
import { 
  formatDate, 
  formatTime, 
  getRelativeDateLabel,
  groupAppointmentsByDate
} from '../../utils/dateUtils';
import Avatar from '../ui/Avatar';

const AppointmentsList = () => {
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Get unique appointment types for filter
  const appointmentTypes = ['all', ...new Set(mockAppointments.map(app => app.type))];
  
  // Filter appointments
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (appointment.notes && appointment.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Group appointments by date
  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);
  
  // Get patient details
  const getPatientDetails = (patientId) => {
    return mockPatients.find(patient => patient.id === patientId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all patient appointments
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
          
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('list')}
            >
              List
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('calendar')}
            >
              Calendar
            </button>
          </div>
          
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus className="h-4 w-4" />}
          >
            New Appointment
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
            placeholder="Search appointments..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* List View */}
      {view === 'list' && (
        <div className="space-y-6">
          {Object.keys(groupedAppointments).length > 0 ? (
            Object.keys(groupedAppointments)
              .sort()
              .map((date) => (
                <Card key={date}>
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      {getRelativeDateLabel(date)} - {formatDate(date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-gray-100">
                    {groupedAppointments[date]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => {
                        const patient = getPatientDetails(appointment.patientId);
                        return (
                          <div 
                            key={appointment.id} 
                            className="flex items-center py-4 first:pt-2 last:pb-2 hover:bg-gray-50 px-2 -mx-2 rounded-md transition-colors"
                          >
                            <div className="flex-shrink-0 mr-4">
                              <div className="flex flex-col items-center justify-center w-16 text-center">
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatTime(appointment.time)}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  {appointment.duration} min
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0 mr-4">
                              <Avatar 
                                src={patient?.avatar} 
                                alt={appointment.patientName} 
                                size="md" 
                                status={patient?.status === 'critical' ? 'busy' : 
                                        patient?.status === 'moderate' ? 'away' : 'online'} 
                              />
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {appointment.patientName}
                              </p>
                              <div className="flex items-center mt-1">
                                <Badge 
                                  text={appointment.type} 
                                  variant="primary" 
                                  size="small" 
                                />
                                {patient?.status === 'critical' && (
                                  <Badge 
                                    text="Critical" 
                                    variant="danger" 
                                    size="small" 
                                    className="ml-2"
                                  />
                                )}
                              </div>
                              {appointment.notes && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {appointment.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex-shrink-0 ml-4">
                              <Badge 
                                text={appointment.status} 
                                variant={
                                  appointment.status === 'scheduled' ? 'primary' : 
                                  appointment.status === 'completed' ? 'success' : 
                                  appointment.status === 'cancelled' ? 'danger' : 
                                  'warning'
                                } 
                              />
                            </div>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <Calendar className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Calendar View (placeholder) */}
      {view === 'calendar' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Calendar View</h3>
              <p className="mt-1 text-sm text-gray-500">
                Calendar view would be implemented here with a full monthly calendar
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsList;