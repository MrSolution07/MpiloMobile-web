import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  ChevronDown,
  UserX
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { mockPatients } from '../../data/mockData';
import { formatDate } from '../../utils/dateUtils';
import Table, { 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHeaderCell 
} from '../ui/Table';

const PatientsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter patients
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'age':
        comparison = a.age - b.age;
        break;
      case 'lastVisit':
        comparison = new Date(a.lastVisit) - new Date(b.lastVisit);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const handlePatientClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and access patient information
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
            Add Patient
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
            placeholder="Search patients by name, email, or phone..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filterOpen && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === 'stable' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('stable')}
                >
                  Stable
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === 'moderate' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('moderate')}
                >
                  Moderate
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('critical')}
                >
                  Critical
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          {sortedPatients.length > 0 ? (
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Patient</TableHeaderCell>
                  <TableHeaderCell 
                    sortable 
                    sorted={sortField === 'age' ? sortDirection : null}
                    onClick={() => handleSort('age')}
                  >
                    Age
                  </TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell 
                    sortable
                    sorted={sortField === 'lastVisit' ? sortDirection : null}
                    onClick={() => handleSort('lastVisit')}
                  >
                    Last Visit
                  </TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow 
                    key={patient.id}
                    onClick={() => handlePatientClick(patient.id)}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar 
                          src={patient.avatar} 
                          alt={patient.name} 
                          size="sm" 
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.gender}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>
                      <p className="text-sm">{patient.phone}</p>
                      <p className="text-xs text-gray-500">{patient.email}</p>
                    </TableCell>
                    <TableCell>
                      {formatDate(patient.lastVisit)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        text={patient.status} 
                        variant={
                          patient.status === 'stable' ? 'success' : 
                          patient.status === 'moderate' ? 'warning' : 'danger'
                        } 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <UserX className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsList;