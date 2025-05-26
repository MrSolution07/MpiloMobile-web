import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  Plus, 
  User,
  Clock,
  Heart,
  Activity
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { mockTriageCases } from '../../data/mockData';
import { formatDateTime } from '../../utils/dateUtils';

const TriageList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter triage cases
  const filteredCases = mockTriageCases.filter(triageCase => {
    const matchesSearch = 
      triageCase.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      triageCase.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || triageCase.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || triageCase.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort cases by priority (high -> medium -> low) and then by arrival time (oldest first)
  const sortedCases = [...filteredCases].sort((a, b) => {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    return new Date(a.arrivalTime) - new Date(b.arrivalTime);
  });
  
  // Group cases by status
  const groupedCases = {
    'waiting': sortedCases.filter(c => c.status === 'waiting'),
    'in-progress': sortedCases.filter(c => c.status === 'in-progress'),
    'completed': sortedCases.filter(c => c.status === 'completed')
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Triage</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and prioritize emergency cases
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
          
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus className="h-4 w-4" />}
          >
            New Triage Case
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
            placeholder="Search by patient name or complaint..."
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
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === 'waiting' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('waiting')}
                >
                  Waiting
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === 'in-progress' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('in-progress')}
                >
                  In Progress
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    statusFilter === 'completed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('high')}
                >
                  High
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('medium')}
                >
                  Medium
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    priorityFilter === 'low' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setPriorityFilter('low')}
                >
                  Low
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Triage Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting */}
        <Card>
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-blue-900 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-700" />
                Waiting
              </CardTitle>
              <Badge text={`${groupedCases.waiting.length} cases`} variant="primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[calc(100vh-300px)] space-y-4">
            {groupedCases.waiting.length > 0 ? (
              groupedCases.waiting.map((triageCase) => (
                <div 
                  key={triageCase.id} 
                  className={`
                    p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow
                    ${triageCase.priority === 'high' ? 'border-l-4 border-l-red-500' : 
                      triageCase.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : 
                      'border-l-4 border-l-green-500'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center">
                        <span className={`block w-2 h-2 rounded-full mr-2 ${getPriorityColor(triageCase.priority)}`}></span>
                        {triageCase.patientName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Arrived: {formatDateTime(triageCase.arrivalTime)}
                      </p>
                    </div>
                    <Badge 
                      text={triageCase.priority} 
                      variant={
                        triageCase.priority === 'high' ? 'danger' : 
                        triageCase.priority === 'medium' ? 'warning' : 'success'
                      }
                      size="small"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      {triageCase.chiefComplaint}
                    </p>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-gray-700">
                        HR: {triageCase.vitalSigns.heartRate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-gray-700">
                        BP: {triageCase.vitalSigns.bloodPressure}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        Temp: {triageCase.vitalSigns.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        O₂: {triageCase.vitalSigns.oxygenSaturation}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="primary" size="sm" fullWidth>
                      Begin Treatment
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">No waiting cases</p>
                <p className="text-xs text-gray-500">All patients are being attended to</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* In Progress */}
        <Card>
          <CardHeader className="bg-yellow-50 border-b border-yellow-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-yellow-900 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-700" />
                In Progress
              </CardTitle>
              <Badge text={`${groupedCases['in-progress'].length} cases`} variant="warning" />
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[calc(100vh-300px)] space-y-4">
            {groupedCases['in-progress'].length > 0 ? (
              groupedCases['in-progress'].map((triageCase) => (
                <div 
                  key={triageCase.id} 
                  className={`
                    p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow
                    ${triageCase.priority === 'high' ? 'border-l-4 border-l-red-500' : 
                      triageCase.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : 
                      'border-l-4 border-l-green-500'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center">
                        <span className={`block w-2 h-2 rounded-full mr-2 ${getPriorityColor(triageCase.priority)}`}></span>
                        {triageCase.patientName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Arrived: {formatDateTime(triageCase.arrivalTime)}
                      </p>
                    </div>
                    <Badge 
                      text={triageCase.priority} 
                      variant={
                        triageCase.priority === 'high' ? 'danger' : 
                        triageCase.priority === 'medium' ? 'warning' : 'success'
                      }
                      size="small"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      {triageCase.chiefComplaint}
                    </p>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-gray-700">
                        HR: {triageCase.vitalSigns.heartRate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-3 w-3 text-blue-500 mr-1" />
                      <span className="text-gray-700">
                        BP: {triageCase.vitalSigns.bloodPressure}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        Temp: {triageCase.vitalSigns.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        O₂: {triageCase.vitalSigns.oxygenSaturation}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="success" size="sm" fullWidth>
                      Complete Treatment
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">No active cases</p>
                <p className="text-xs text-gray-500">No patients are currently being treated</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Completed */}
        <Card>
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-green-900 flex items-center">
                <User className="mr-2 h-5 w-5 text-green-700" />
                Completed
              </CardTitle>
              <Badge text={`${groupedCases.completed.length} cases`} variant="success" />
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[calc(100vh-300px)] space-y-4">
            {groupedCases.completed.length > 0 ? (
              groupedCases.completed.map((triageCase) => (
                <div 
                  key={triageCase.id} 
                  className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {triageCase.patientName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Arrived: {formatDateTime(triageCase.arrivalTime)}
                      </p>
                    </div>
                    <Badge 
                      text={triageCase.priority} 
                      variant={
                        triageCase.priority === 'high' ? 'danger' : 
                        triageCase.priority === 'medium' ? 'warning' : 'success'
                      }
                      size="small"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">
                      {triageCase.chiefComplaint}
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    <Badge text="Completed" variant="success" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <User className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">No completed cases</p>
                <p className="text-xs text-gray-500">Cases will appear here once completed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriageList;