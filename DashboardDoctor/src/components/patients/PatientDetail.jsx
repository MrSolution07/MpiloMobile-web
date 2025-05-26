import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  MessageSquare, 
  FileText, 
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  Heart
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { 
  mockPatients, 
  mockAppointments, 
  mockMedicalRecords 
} from '../../data/mockData';
import { formatDate } from '../../utils/dateUtils';

const PatientDetail = () => {
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Patient Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The patient you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Link to="/patients">
              <Button variant="primary">Back to Patients</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Get patient's appointments and records
  const patientAppointments = mockAppointments
    .filter(a => a.patientId === id)
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
  
  const patientRecords = mockMedicalRecords
    .filter(r => r.patientId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return (
    <div className="space-y-6">
      <div>
        <Link to="/patients" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Patients
        </Link>
      </div>
      
      {/* Patient Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar 
                src={patient.avatar} 
                alt={patient.name}
                size="xl"
                status={
                  patient.status === 'critical' ? 'busy' : 
                  patient.status === 'moderate' ? 'away' : 'online'
                }
                className="mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-sm text-gray-500">
                {patient.age} years • {patient.gender}
              </p>
              <div className="mt-2">
                <Badge 
                  text={patient.status} 
                  variant={
                    patient.status === 'stable' ? 'success' : 
                    patient.status === 'moderate' ? 'warning' : 'danger'
                  }
                />
              </div>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{patient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{patient.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Insurance</p>
                    <p className="text-sm text-gray-900">{patient.insuranceProvider}</p>
                    <p className="text-xs text-gray-500">{patient.insuranceNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit Patient Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Medical Records */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Medical Records
              </CardTitle>
              <Link to="/records">
                <Button variant="ghost" size="sm">View All Records</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {patientRecords.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {patientRecords.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{record.diagnosis}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(record.date)}</p>
                      </div>
                      <Badge text="View Details" variant="primary" size="small" />
                    </div>
                    
                    {record.symptoms.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500">Symptoms:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
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
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500">Medications:</p>
                        <ul className="mt-1 text-sm text-gray-700 space-y-1">
                          {record.medications.map((medication, index) => (
                            <li key={index}>
                              {medication.name} ({medication.dosage}, {medication.frequency})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-md">
                        <p className="text-xs font-medium text-gray-500">Notes:</p>
                        <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">No medical records</p>
                <p className="text-xs text-gray-500">This patient has no medical records yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Appointments */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Appointments
            </CardTitle>
            <Button 
              variant="primary" 
              size="sm"
              icon={<Plus className="h-4 w-4" />}
            >
              Schedule Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {patientAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {patientAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-2 w-12 h-12 flex flex-col items-center justify-center text-center mr-4">
                      <span className="text-xs font-medium">
                        {formatDate(appointment.date).split(' ')[1]}
                      </span>
                      <span className="text-xs">
                        {formatDate(appointment.date).split(' ')[0]}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.type} ({appointment.duration} min)
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.date)}, {appointment.time}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Badge 
                      text={appointment.status} 
                      variant={
                        appointment.status === 'scheduled' ? 'primary' : 
                        appointment.status === 'completed' ? 'success' : 
                        appointment.status === 'cancelled' ? 'danger' : 'warning'
                      } 
                    />
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-900">No appointments</p>
              <p className="text-xs text-gray-500">This patient has no scheduled appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetail;