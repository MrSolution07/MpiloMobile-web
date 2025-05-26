import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  FilePlus,
  User
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { mockMedicalRecords, mockPatients } from '../../data/mockData';
import { formatDate } from '../../utils/dateUtils';

const MedicalRecordsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('all');
  
  // Get unique diagnoses for filter
  const diagnoses = ['all', ...new Set(mockMedicalRecords.map(record => record.diagnosis))];
  
  // Filter records
  const filteredRecords = mockMedicalRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDiagnosis = selectedDiagnosis === 'all' || record.diagnosis === selectedDiagnosis;
    
    return matchesSearch && matchesDiagnosis;
  });
  
  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get patient details
  const getPatientDetails = (patientId) => {
    return mockPatients.find(patient => patient.id === patientId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage patient medical records
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
            New Record
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
            placeholder="Search by patient, diagnosis, or notes..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filterOpen && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <select
                className="w-full p-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDiagnosis}
                onChange={(e) => setSelectedDiagnosis(e.target.value)}
              >
                {diagnoses.map((diagnosis) => (
                  <option key={diagnosis} value={diagnosis}>
                    {diagnosis === 'all' ? 'All Diagnoses' : diagnosis}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Records List */}
      <div className="space-y-6">
        {sortedRecords.length > 0 ? (
          sortedRecords.map((record) => {
            const patient = getPatientDetails(record.patientId);
            return (
              <Card key={record.id} hoverable className="hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                      <Avatar 
                        src={patient?.avatar} 
                        alt={record.patientName} 
                        size="lg" 
                        className="mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{record.patientName}</h3>
                        <p className="text-sm text-gray-500">Patient ID: {record.patientId}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{formatDate(record.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-md font-medium text-gray-900">Diagnosis:</h4>
                        <Badge 
                          text={record.diagnosis} 
                          variant="primary" 
                        />
                      </div>
                      
                      {record.symptoms.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms:</h4>
                          <div className="flex flex-wrap gap-1">
                            {record.symptoms.map((symptom, index) => (
                              <Badge 
                                key={index}
                                text={symptom}
                                variant="neutral"
                                size="small"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {record.medications.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Medications:</h4>
                          <ul className="text-sm text-gray-700 space-y-1 ml-5 list-disc">
                            {record.medications.map((medication, index) => (
                              <li key={index}>
                                <span className="font-medium">{medication.name}</span> ({medication.dosage}, {medication.frequency})
                                <span className="text-xs text-gray-500 ml-1">
                                  started {formatDate(medication.startDate)}
                                  {medication.endDate ? `, ended ${formatDate(medication.endDate)}` : ''}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {record.notes && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Recorded by: {record.doctorName}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        icon={<FileText className="h-4 w-4" />}
                      >
                        View Full Record
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        icon={<FilePlus className="h-4 w-4" />}
                      >
                        Add Follow-up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No medical records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsList;