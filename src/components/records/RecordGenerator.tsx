import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card-custom';
import {Button} from '../ui/Button-record';
import  {Input}  from '../ui/Input';
import  {Label}  from '../ui/label';
import  {Textarea}  from '../ui/textarea';
import  {Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Download, Eye, X, Stethoscope } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { RecordPdf, dummyMedicalData } from './RecordPdf';

// Type definition for medical record data
interface MedicalRecordData {
  // Patient Information
  patientId?: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  contactNumber: string;
  address: string;
  medicalAid?: string;
  medicalAidNumber?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  
  // Visit Information
  visitDate?: string;
  visitTime: string;
  attendingPhysician: string;
  department?: string;
  
  // Vital Signs
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  
  // Medical Information
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  medications?: string;
  followUpInstructions?: string;
}

export const MedicalRecordGenerator = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);
  
  const [medicalData, setMedicalData] = useState<MedicalRecordData>({
    patientName: '',
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    contactNumber: '',
    address: '',
    medicalAid: '',
    medicalAidNumber: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '',
    attendingPhysician: '',
    department: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    respiratoryRate: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    diagnosis: '',
    treatmentPlan: '',
    medications: '',
    followUpInstructions: ''
  });

  const handleInputChange = (field: keyof MedicalRecordData, value: string) => {
    setMedicalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateRecord = () => {
    return medicalData.patientName && medicalData.dateOfBirth && 
           medicalData.gender && medicalData.contactNumber && 
           medicalData.attendingPhysician;
  };

  const previewRecord = () => {
    if (!useDummyData && !validateRecord()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields or use dummy data for testing.',
        variant: 'destructive'
      });
      return;
    }
    setShowPreview(true);
  };

  const loadDummyData = () => {
    setMedicalData(dummyMedicalData);
    setUseDummyData(true);
    toast({
      title: 'Dummy Data Loaded',
      description: 'Sample medical record data has been loaded for testing.',
    });
  };

  const clearData = () => {
    setMedicalData({
      patientName: '',
      dateOfBirth: '',
      gender: '',
      idNumber: '',
      contactNumber: '',
      address: '',
      medicalAid: '',
      medicalAidNumber: '',
      emergencyContactName: '',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: '',
      attendingPhysician: '',
      department: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      respiratoryRate: '',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      physicalExamination: '',
      diagnosis: '',
      treatmentPlan: '',
      medications: '',
      followUpInstructions: ''
    });
    setUseDummyData(false);
  };

  const currentData = useDummyData ? dummyMedicalData : medicalData;

  const DownloadButton = () => (
    <PDFDownloadLink 
      document={<RecordPdf data={currentData} />}
      fileName={`medical_record_${currentData.patientName}_${currentData.visitDate}.pdf`}
    >
      {({ loading }) => (
        <Button className="flex-1" disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Preparing...' : 'Download Record'}
        </Button>
      )}
    </PDFDownloadLink>
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Medical Record Generator</span>
          </CardTitle>
          <CardDescription>
            Create professional medical records for patient visits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="flex space-x-2 mb-4">
            <Button onClick={loadDummyData} variant="outline" size="sm">
              Load Test Data
            </Button>
            <Button onClick={clearData} variant="outline" size="sm">
              Clear All
            </Button>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient full name"
                  value={medicalData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={medicalData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={medicalData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  placeholder="South African ID Number"
                  value={medicalData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  placeholder="+27 82 123 4567"
                  value={medicalData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Patient address"
                  value={medicalData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="medicalAid">Medical Aid</Label>
                  <Input
                    id="medicalAid"
                    placeholder="Discovery, Momentum, etc."
                    value={medicalData.medicalAid}
                    onChange={(e) => handleInputChange('medicalAid', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalAidNumber">Medical Aid Number</Label>
                  <Input
                    id="medicalAidNumber"
                    placeholder="Member number"
                    value={medicalData.medicalAidNumber}
                    onChange={(e) => handleInputChange('medicalAidNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Contact person name"
                  value={medicalData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Input
                  id="emergencyContactRelation"
                  placeholder="Spouse, Parent, Sibling, etc."
                  value={medicalData.emergencyContactRelation}
                  onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+27 83 987 6543"
                  value={medicalData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700">Visit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={medicalData.visitDate}
                  onChange={(e) => handleInputChange('visitDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitTime">Visit Time</Label>
                <Input
                  id="visitTime"
                  type="time"
                  value={medicalData.visitTime}
                  onChange={(e) => handleInputChange('visitTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendingPhysician">Attending Physician *</Label>
                <Input
                  id="attendingPhysician"
                  placeholder="Dr. Smith"
                  value={medicalData.attendingPhysician}
                  onChange={(e) => handleInputChange('attendingPhysician', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={medicalData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  placeholder="120/80"
                  value={medicalData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  placeholder="72"
                  value={medicalData.heartRate}
                  onChange={(e) => handleInputChange('heartRate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  placeholder="36.5"
                  value={medicalData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="65"
                  value={medicalData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="165"
                  value={medicalData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Resp. Rate (/min)</Label>
                <Input
                  id="respiratoryRate"
                  placeholder="16"
                  value={medicalData.respiratoryRate}
                  onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Medical Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Primary reason for the visit..."
                value={medicalData.chiefComplaint}
                onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
                <Textarea
                  id="historyOfPresentIllness"
                  placeholder="Detailed history of current condition..."
                  value={medicalData.historyOfPresentIllness}
                  onChange={(e) => handleInputChange('historyOfPresentIllness', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physicalExamination">Physical Examination</Label>
                <Textarea
                  id="physicalExamination"
                  placeholder="Physical examination findings..."
                  value={medicalData.physicalExamination}
                  onChange={(e) => handleInputChange('physicalExamination', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Medical diagnosis..."
                value={medicalData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  placeholder="Treatment and management plan..."
                  value={medicalData.treatmentPlan}
                  onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="Prescribed medications with dosage..."
                  value={medicalData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpInstructions">Follow-up Instructions</Label>
              <Textarea
                id="followUpInstructions"
                placeholder="Follow-up care instructions..."
                value={medicalData.followUpInstructions}
                onChange={(e) => handleInputChange('followUpInstructions', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={previewRecord} 
              variant="outline" 
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Record
            </Button>
            <DownloadButton />
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Medical Record Preview</h2>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 border rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="100%" className="min-h-[70vh]">
                <RecordPdf data={currentData} />
              </PDFViewer>
            </div>
            
            <div className="mt-4 flex justify-end">
              <DownloadButton />
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                className="ml-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordGenerator;