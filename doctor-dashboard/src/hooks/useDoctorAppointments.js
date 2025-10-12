// // hooks/useDoctorAppointments.js
// import { useState, useEffect, useMemo } from "react";
// import { supabase } from "../services/supabaseClient";
// import { useAuth } from "../context/AuthProvider";

// export function useDoctorAppointments() {
//   const { user } = useAuth();
//   const [appointments, setAppointments] = useState([]);
//   const [doctorId, setDoctorId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // First, find the doctor ID using the authenticated user's email
//   useEffect(() => {
//     if (!user?.email) return;

//     const findDoctorId = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Query the doctors table to find the doctor with matching email
//         const { data: doctorData, error: doctorError } = await supabase
//           .from('doctors')
//           .select('id')
//           .eq('email', user.email)
//           .single(); // We expect only one doctor with this email

//         if (doctorError) {
//           throw new Error(`Doctor not found: ${doctorError.message}`);
//         }

//         if (!doctorData) {
//           throw new Error('No doctor found with this email address');
//         }

//         setDoctorId(doctorData.id);
//         console.log("Found doctor ID:", doctorData.id);

//       } catch (err) {
//         console.error('Error finding doctor ID:', err);
//         setError(err.message || 'Failed to find doctor profile');
//         setLoading(false);
//       }
//     };

//     findDoctorId();
//   }, [user?.email]);

//   // Once we have the doctor ID, fetch their appointments
//   useEffect(() => {
//     if (!doctorId) return;

//     fetchDoctorAppointments();
//   }, [doctorId]);

//   const fetchDoctorAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Fetching appointments for doctor ID:", doctorId);

//       // Fetch appointments for this doctor
//       const { data: appointmentsData, error: appointmentsError } = await supabase
//         .from('appointments')
//         .select('*')
//         .eq('doctor_id', doctorId)
//         .order('scheduled_datetime', { ascending: true });

//       if (appointmentsError) {
//         throw appointmentsError;
//       }

//       console.log("Raw appointments data:", appointmentsData);

//       // If we have appointments, fetch patient details separately
//       if (appointmentsData && appointmentsData.length > 0) {
//         const patientIds = appointmentsData.map(app => app.patient_id).filter(Boolean);
        
//         let patientsData = [];
//         if (patientIds.length > 0) {
//           const { data: patients, error: patientsError } = await supabase
//             .from('patients')
//             .select('*')
//             .in('id', patientIds);

//           if (patientsError) {
//             console.warn("Error fetching patients:", patientsError);
//           } else {
//             patientsData = patients || [];
//           }
//         }

//         // Combine appointments with patient data
//         const appointmentsWithPatients = appointmentsData.map(appointment => {
//           const patient = patientsData.find(p => p.id === appointment.patient_id);
//           return {
//             ...appointment,
//             patients: patient || null
//           };
//         });

//         setAppointments(appointmentsWithPatients);
//       } else {
//         setAppointments([]);
//       }

//     } catch (err) {
//       console.error('Error fetching doctor appointments:', err);
//       setError(err.message || 'Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Alternative: Use join query if you prefer
//   const fetchWithJoin = async () => {
//     try {
//       const { data, error: joinError } = await supabase
//         .from('appointments')
//         .select(`
//           *,
//           patients (*)
//         `)
//         .eq('doctor_id', doctorId)
//         .order('scheduled_datetime', { ascending: true });

//       if (joinError) {
//         console.error("Join error:", joinError);
//         // Fall back to separate queries
//         await fetchDoctorAppointments();
//         return;
//       }

//       setAppointments(data || []);
//     } catch (err) {
//       console.error('Error in join fetch:', err);
//       await fetchDoctorAppointments();
//     }
//   };

//   // Subscribe to real-time updates
//   useEffect(() => {
//     if (!doctorId) return;

//     const subscription = supabase
//       .channel('appointments_changes')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'appointments',
//           filter: `doctor_id=eq.${doctorId}`
//         },
//         (payload) => {
//           fetchDoctorAppointments();
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [doctorId]);

//   // Memoized filtered appointments function
//   const filteredAppointments = useMemo(() => {
//     return (filters = {}) => {
//       const { searchQuery = "", statusFilter = "all", typeFilter = "all" } = filters;
      
//       return appointments.filter((appointment) => {
//         const patientName = appointment.patients?.name || appointment.patients?.full_name || '';
//         const notes = appointment.reason_for_visit || '';
        
//         const matchesSearch =
//           patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           notes.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesStatus =
//           statusFilter === "all" || appointment.status === statusFilter;
//         const matchesType =
//           typeFilter === "all" || appointment.appointment_type === typeFilter;

//         return matchesSearch && matchesStatus && matchesType;
//       });
//     };
//   }, [appointments]);

//   const appointmentStats = useMemo(() => {
//     const total = appointments.length;
//     const scheduled = appointments.filter(app => app.status === "scheduled").length;
//     const completed = appointments.filter(app => app.status === "completed").length;
//     const cancelled = appointments.filter(app => app.status === "cancelled").length;
//     const noShow = appointments.filter(app => app.status === "no_show").length;

//     return {
//       total,
//       scheduled,
//       completed,
//       cancelled,
//       noShow,
//       completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
//     };
//   }, [appointments]);

//   // Format appointment data for UI compatibility
//   const formatAppointmentForUI = (appointment) => {
//     if (!appointment.scheduled_datetime) {
//       console.warn("Invalid appointment data:", appointment);
//       return null;
//     }

//     try {
//       const scheduledDate = new Date(appointment.scheduled_datetime);
//       const date = scheduledDate.toISOString().split('T')[0];
//       const time = scheduledDate.toTimeString().substring(0, 5);
      
//       const patient = appointment.patients || {};
      
//       return {
//         id: appointment.id,
//         patientId: appointment.patient_id,
//         patientName: patient.name || patient.full_name || 'Unknown Patient',
//         doctorId: appointment.doctor_id,
//         date: date,
//         time: time,
//         duration: appointment.estimated_duration,
//         type: appointment.appointment_type,
//         status: appointment.status,
//         notes: appointment.reason_for_visit,
//         symptoms: appointment.symptoms,
//         specialRequirements: appointment.special_requirements,
//         // For avatar and patient status
//         patient: {
//           avatar: patient.avatar,
//           status: patient.status || patient.condition_status
//         }
//       };
//     } catch (error) {
//       console.error("Error formatting appointment:", error, appointment);
//       return null;
//     }
//   };

//   const formattedAppointments = useMemo(() => {
//     return appointments
//       .map(formatAppointmentForUI)
//       .filter(app => app !== null);
//   }, [appointments]);

//   const getFilteredFormattedAppointments = (filters) => {
//     const filtered = filteredAppointments(filters);
//     return filtered.map(formatAppointmentForUI).filter(app => app !== null);
//   };

//   return {
//     rawAppointments: appointments,
//     appointments: formattedAppointments,
//     filteredAppointments: getFilteredFormattedAppointments,
//     appointmentStats,
//     doctorId,
//     loading,
//     error,
//     refresh: fetchDoctorAppointments
//   };
// }





// hooks/useDoctorAppointments.js
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthProvider";

export function useDoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({}); // Store patients by ID
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // First, find the doctor ID using the authenticated user's email
  useEffect(() => {
    if (!user?.email) return;

    const findDoctorId = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query the doctors table to find the doctor with matching email
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('email', user.email)
          .single();

        if (doctorError) {
          throw new Error(`Doctor not found: ${doctorError.message}`);
        }

        if (!doctorData) {
          throw new Error('No doctor found with this email address');
        }

        setDoctorId(doctorData.id);
        console.log("Found doctor ID:", doctorData.id);

      } catch (err) {
        console.error('Error finding doctor ID:', err);
        setError(err.message || 'Failed to find doctor profile');
        setLoading(false);
      }
    };

    findDoctorId();
  }, [user?.email]);

  // Fetch all patients data
  const fetchPatients = async (patientIds) => {
    if (!patientIds || patientIds.length === 0) return {};

    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .in('id', patientIds);

      if (patientsError) {
        console.warn("Error fetching patients:", patientsError);
        return {};
      }

      // Convert array to object with patient ID as key
      const patientsMap = {};
      patientsData.forEach(patient => {
        patientsMap[patient.id] = patient;
      });

      return patientsMap;
    } catch (err) {
      console.error('Error fetching patients:', err);
      return {};
    }
  };

  // Once we have the doctor ID, fetch their appointments
  useEffect(() => {
    if (!doctorId) return;

    fetchDoctorAppointments();
  }, [doctorId]);

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching appointments for doctor ID:", doctorId);

      // Fetch appointments for this doctor
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('scheduled_datetime', { ascending: true });

      if (appointmentsError) {
        throw appointmentsError;
      }

      console.log("Raw appointments data:", appointmentsData);

      // Extract unique patient IDs from appointments
      const patientIds = [...new Set(appointmentsData
        .map(app => app.patient_id)
        .filter(Boolean)
      )];

      // Fetch patient data for all appointments
      const patientsMap = await fetchPatients(patientIds);
      setPatients(patientsMap);

      // Store appointments with patient IDs
      setAppointments(appointmentsData || []);

    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!doctorId) return;

    const subscription = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${doctorId}`
        },
        (payload) => {
          fetchDoctorAppointments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [doctorId]);

  // Memoized filtered appointments function
  const filteredAppointments = useMemo(() => {
    return (filters = {}) => {
      const { searchQuery = "", statusFilter = "all", typeFilter = "all" } = filters;
      
      return appointments.filter((appointment) => {
        const patient = patients[appointment.patient_id] || {};
        const patientName = patient.name || patient.full_name || 'Unknown Patient';
        const notes = appointment.reason_for_visit || '';
        
        const matchesSearch =
          patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notes.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || appointment.status === statusFilter;
        const matchesType =
          typeFilter === "all" || appointment.appointment_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      });
    };
  }, [appointments, patients]);

  const appointmentStats = useMemo(() => {
    const total = appointments.length;
    const scheduled = appointments.filter(app => app.status === "scheduled").length;
    const completed = appointments.filter(app => app.status === "completed").length;
    const cancelled = appointments.filter(app => app.status === "cancelled").length;
    const noShow = appointments.filter(app => app.status === "no_show").length;

    return {
      total,
      scheduled,
      completed,
      cancelled,
      noShow,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
  }, [appointments]);

  // Format appointment data for UI compatibility
  const formatAppointmentForUI = (appointment) => {
    if (!appointment.scheduled_datetime) {
      console.warn("Invalid appointment data:", appointment);
      return null;
    }

    try {
      const scheduledDate = new Date(appointment.scheduled_datetime);
      const date = scheduledDate.toISOString().split('T')[0];
      const time = scheduledDate.toTimeString().substring(0, 5);
      
      const patient = patients[appointment.patient_id] || {};
      
      return {
        id: appointment.id,
        patientId: appointment.patient_id,
        patientName: patient.first_name || patient.full_name || 'Unknown Patient',
        patientEmail: patient.email,
        patientPhone: patient.phone,
        patientDateOfBirth: patient.date_of_birth,
        doctorId: appointment.doctor_id,
        date: date,
        time: time,
        duration: appointment.estimated_duration,
        type: appointment.appointment_type,
        status: appointment.status,
        notes: appointment.reason_for_visit,
        symptoms: appointment.symptoms,
        specialRequirements: appointment.special_requirements,
        // For avatar and patient status
        patient: {
          avatar: patient.avatar,
          status: patient.status || patient.condition_status,
          gender: patient.gender,
          bloodType: patient.blood_type
        }
      };
    } catch (error) {
      console.error("Error formatting appointment:", error, appointment);
      return null;
    }
  };

  const formattedAppointments = useMemo(() => {
    return appointments
      .map(formatAppointmentForUI)
      .filter(app => app !== null);
  }, [appointments, patients]);

  const getFilteredFormattedAppointments = (filters) => {
    const filtered = filteredAppointments(filters);
    return filtered.map(appointment => formatAppointmentForUI(appointment)).filter(app => app !== null);
  };

  return {
    rawAppointments: appointments,
    appointments: formattedAppointments,
    filteredAppointments: getFilteredFormattedAppointments,
    appointmentStats,
    doctorId,
    loading,
    error,
    refresh: fetchDoctorAppointments
  };
}