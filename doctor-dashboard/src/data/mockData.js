import profile from "../../../src/assets/profileImg.png";

export const currentUser = {
  id: 'u1',
  name: 'Dr. BULABULA HUSSEIN',
  role: 'doctor',
  department: 'Family Medicine',
  email: 'sarah.johnson@mediclinic.com',
  avatar: profile
};

export const mockPatients = [
  {
    id: 'p1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 12345',
    insuranceProvider: 'Blue Cross',
    insuranceNumber: 'BC123456789',
    lastVisit: '2023-11-15',
    status: 'stable',
    avatar: profile
  },
  {
    id: 'p2',
    name: 'Emily Johnson',
    age: 32,
    gender: 'Female',
    email: 'emily.johnson@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, NY 54321',
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AE987654321',
    lastVisit: '2023-12-03',
    status: 'moderate',
    avatar: profile
  },
  {
    id: 'p3',
    name: 'Michael Rodriguez',
    age: 58,
    gender: 'Male',
    email: 'michael.r@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Elsewhere, TX 67890',
    insuranceProvider: 'Medicare',
    insuranceNumber: 'MC456789012',
    lastVisit: '2023-12-10',
    status: 'critical',
    avatar: profile
  },
  {
    id: 'p4',
    name: 'Sarah Williams',
    age: 29,
    gender: 'Female',
    email: 'sarah.w@example.com',
    phone: '(555) 234-5678',
    address: '101 Maple Dr, Nowhere, FL 10101',
    insuranceProvider: 'Cigna',
    insuranceNumber: 'CI234567890',
    lastVisit: '2023-12-15',
    status: 'stable',
    avatar: profile
  },
  {
    id: 'p5',
    name: 'David Chen',
    age: 41,
    gender: 'Male',
    email: 'david.c@example.com',
    phone: '(555) 876-5432',
    address: '202 Birch Ln, Anyplace, WA 20202',
    insuranceProvider: 'United Healthcare',
    insuranceNumber: 'UH876543210',
    lastVisit: '2023-12-18',
    status: 'moderate',
    avatar: profile
  }
];

export const mockAppointments = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'John Smith',
    date: '2024-06-10',
    time: '09:00',
    duration: 30,
    type: 'Check-up',
    status: 'scheduled',
    notes: 'Follow-up on blood pressure medication.'
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Emily Johnson',
    date: '2024-06-10',
    time: '10:00',
    duration: 45,
    type: 'Consultation',
    status: 'scheduled',
    notes: 'Discussing lab results and treatment options.'
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Michael Rodriguez',
    date: '2024-06-10',
    time: '11:15',
    duration: 60,
    type: 'Urgent Care',
    status: 'scheduled',
    notes: 'Patient reporting chest pain and shortness of breath.'
  },
  {
    id: 'a4',
    patientId: 'p4',
    patientName: 'Sarah Williams',
    date: '2024-06-11',
    time: '09:30',
    duration: 30,
    type: 'Check-up',
    status: 'scheduled'
  },
  {
    id: 'a5',
    patientId: 'p5',
    patientName: 'David Chen',
    date: '2024-06-11',
    time: '10:30',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled',
    notes: 'Review recent imaging results.'
  },
  {
    id: 'a6',
    patientId: 'p1',
    patientName: 'John Smith',
    date: '2024-06-12',
    time: '14:00',
    duration: 30,
    type: 'Follow-up',
    status: 'scheduled'
  }
];

export const mockMessages = [
  {
    id: 'm1',
    senderId: 'p1',
    senderName: 'John Smith',
    senderAvatar: profile,
    recipientId: 'u1',
    recipientName: 'Dr. Sarah Johnson',
    timestamp: '2024-06-09T09:45:00',
    content: 'Good morning Dr. Johnson, I\'ve been experiencing increased headaches since starting the new medication. Should I continue taking it?',
    read: false,
    urgent: false
  },
  {
    id: 'm2',
    senderId: 'p3',
    senderName: 'Michael Rodriguez',
    senderAvatar: profile,
    recipientId: 'u1',
    recipientName: 'Dr. Sarah Johnson',
    timestamp: '2024-06-09T11:23:00',
    content: 'Dr. Johnson, the chest pain has returned and is worse than before. I\'m also feeling dizzy. Should I go to the emergency room?',
    read: false,
    urgent: true
  },
  {
    id: 'm3',
    senderId: 'u2',
    senderName: 'Dr. Robert Chen',
    recipientId: 'u1',
    recipientName: 'Dr. Sarah Johnson',
    timestamp: '2024-06-09T14:15:00',
    content: 'Sarah, I\'ve reviewed Michael Rodriguez\'s file. We should consider adjusting his medication. Let\'s discuss this when you have a moment.',
    read: true,
    urgent: false
  },
  {
    id: 'm4',
    senderId: 'p4',
    senderName: 'Sarah Williams',
    senderAvatar: profile,
    recipientId: 'u1',
    recipientName: 'Dr. Sarah Johnson',
    timestamp: '2024-06-09T16:30:00',
    content: 'Hello Dr. Johnson, I wanted to confirm my appointment for tomorrow at 9:30 AM. Will I need to fast before the blood work?',
    read: true,
    urgent: false
  },
  {
    id: 'm5',
    senderId: 'u1',
    senderName: 'Dr. Sarah Johnson',
    recipientId: 'p4',
    recipientName: 'Sarah Williams',
    timestamp: '2024-06-09T17:05:00',
    content: 'Hi Sarah, yes, your appointment is confirmed for tomorrow at 9:30 AM. Please fast for at least 8 hours before the appointment for accurate blood work results. See you tomorrow.',
    read: true,
    urgent: false
  }
];

export const mockMedicalRecords = [
  {
    id: 'mr1',
    patientId: 'p1',
    patientName: 'John Smith',
    date: '2023-11-15',
    diagnosis: 'Hypertension',
    symptoms: ['Headache', 'Dizziness', 'Fatigue'],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2023-11-15'
      }
    ],
    notes: 'Patient advised to reduce sodium intake and increase physical activity.',
    doctorId: 'u1',
    doctorName: 'Dr. Sarah Johnson'
  },
  {
    id: 'mr2',
    patientId: 'p2',
    patientName: 'Emily Johnson',
    date: '2023-12-03',
    diagnosis: 'Migraine',
    symptoms: ['Severe headache', 'Nausea', 'Light sensitivity'],
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed for migraine',
        startDate: '2023-12-03'
      },
      {
        name: 'Propranolol',
        dosage: '40mg',
        frequency: 'Twice daily',
        startDate: '2023-12-03'
      }
    ],
    notes: 'Patient advised to identify and avoid migraine triggers.',
    doctorId: 'u1',
    doctorName: 'Dr. Sarah Johnson'
  },
  {
    id: 'mr3',
    patientId: 'p3',
    patientName: 'Michael Rodriguez',
    date: '2023-12-10',
    diagnosis: 'Coronary Artery Disease',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
    medications: [
      {
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        startDate: '2023-12-10'
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        startDate: '2023-12-10'
      },
      {
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        startDate: '2023-12-10'
      }
    ],
    notes: 'Patient scheduled for follow-up stress test in 3 months. Referred to cardiac rehabilitation program.',
    doctorId: 'u1',
    doctorName: 'Dr. Sarah Johnson'
  }
];

export const mockTriageCases = [
  {
    id: 't1',
    patientId: 'p3',
    patientName: 'Michael Rodriguez',
    arrivalTime: '2024-06-09T08:45:00',
    chiefComplaint: 'Chest pain and shortness of breath',
    vitalSigns: {
      temperature: 37.2,
      heartRate: 112,
      bloodPressure: '165/95',
      respiratoryRate: 22,
      oxygenSaturation: 92
    },
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'u1'
  },
  {
    id: 't2',
    patientId: 'p6',
    patientName: 'Jennifer Lee',
    arrivalTime: '2024-06-09T09:15:00',
    chiefComplaint: 'Severe abdominal pain',
    vitalSigns: {
      temperature: 38.1,
      heartRate: 98,
      bloodPressure: '130/85',
      respiratoryRate: 18,
      oxygenSaturation: 97
    },
    priority: 'medium',
    status: 'waiting'
  },
  {
    id: 't3',
    patientId: 'p7',
    patientName: 'Robert Wilson',
    arrivalTime: '2024-06-09T09:30:00',
    chiefComplaint: 'Sprained ankle',
    vitalSigns: {
      temperature: 36.9,
      heartRate: 75,
      bloodPressure: '120/80',
      respiratoryRate: 16,
      oxygenSaturation: 99
    },
    priority: 'low',
    status: 'waiting'
  },
  {
    id: 't4',
    patientId: 'p8',
    patientName: 'Maria Garcia',
    arrivalTime: '2024-06-09T10:00:00',
    chiefComplaint: 'High fever and cough',
    vitalSigns: {
      temperature: 39.2,
      heartRate: 105,
      bloodPressure: '125/85',
      respiratoryRate: 20,
      oxygenSaturation: 95
    },
    priority: 'medium',
    status: 'waiting'
  }
];

export const mockTasks = [
  {
    id: 'task1',
    title: 'Review Michael Rodriguez\'s cardiac test results',
    description: 'Check the latest EKG and stress test results and update treatment plan accordingly.',
    dueDate: '2024-06-10',
    priority: 'high',
    status: 'pending',
    assignedTo: 'u1',
    assignedToName: 'Dr. Sarah Johnson',
    createdBy: 'u1'
  },
  {
    id: 'task2',
    title: 'Follow up with Emily Johnson about migraine treatment',
    description: 'Call to check if the new medication is helping with symptoms.',
    dueDate: '2024-06-12',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'u1',
    assignedToName: 'Dr. Sarah Johnson',
    createdBy: 'u1'
  },
  {
    id: 'task3',
    title: 'Complete medical records for today\'s patients',
    dueDate: '2024-06-09',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'u1',
    assignedToName: 'Dr. Sarah Johnson',
    createdBy: 'u1'
  },
  {
    id: 'task4',
    title: 'Review department schedule for next week',
    description: 'Ensure proper coverage and make necessary adjustments.',
    dueDate: '2024-06-11',
    priority: 'low',
    status: 'pending',
    assignedTo: 'u1',
    assignedToName: 'Dr. Sarah Johnson',
    createdBy: 'u3'
  }
];

export const getDashboardStats = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    appointmentsToday: mockAppointments.filter(
      appointment => appointment.date === today
    ).length,
    pendingMessages: mockMessages.filter(
      message => !message.read && message.recipientId === currentUser.id
    ).length,
    criticalPatients: mockPatients.filter(
      patient => patient.status === 'critical'
    ).length,
    triageCases: mockTriageCases.filter(
      triage => triage.status === 'waiting' || triage.status === 'in-progress'
    ).length
  };
};