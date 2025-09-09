// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthProvider';
// import { supabase } from '../../services/supabaseClient';

// export default function DoctorProfile() {
//   const { user } = useAuth();
//   const [doctor, setDoctor] = useState({
//     name: '',
//     email: '',
//     phone_number: '',
//     specialization: '',
//     status: 'Available',
//     imageUrl: 'https://www.gravatar.com/avatar/?d=mp',
//     doctor_number: '',
//     license_number: '',
//     hpcsa_number: '',
//     qualification: '',
//     experience_years: null,
//     consultation_fee: null,
//     rating: 0.00,
//     total_reviews: 0,
//     languages: null,
//     biography: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDoctorProfile = async () => {
//       if (user?.email) {
//         try {
//           setLoading(true);
//           const { data: doctorData, error: doctorError } = await supabase
//             .from('doctors')
//             .select('*')
//             .eq('email', user.email)
//             .single();

//           if (doctorData && !doctorError) {
//             setDoctor({
//               name: `Dr ${doctorData.first_name} ${doctorData.last_name}`,
//               email: doctorData.email || user.email,
//               phone_number: doctorData.phone_number || 'Not provided',
//               specialization: doctorData.specialization || 'General Practitioner',
//               status: doctorData.is_available ? 'Available' : 'Unavailable',
//               imageUrl: doctorData.profile_image_url || 'https://www.gravatar.com/avatar/?d=mp',
//               doctor_number: doctorData.doctor_number || 'Not assigned',
//               license_number: doctorData.license_number || 'Not provided',
//               hpcsa_number: doctorData.hpcsa_number || 'Not provided',
//               qualification: doctorData.qualification || 'Medicine Degree and Master',
//               experience_years: doctorData.experience_years || 0,
//               consultation_fee: doctorData.consultation_fee || 0,
//               rating: doctorData.rating || 0.00,
//               total_reviews: doctorData.total_reviews || 0,
//               languages: doctorData.languages || ['English'],
//               biography: doctorData.biography || 'No biography available',
//             });
//           } else {
//             // Fallback to user metadata or email
//             const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
//             setDoctor({
//               name: `Dr ${fallbackName}`,
//               email: user.email,
//               phone_number: 'Not provided',
//               specialization: 'General Practitioner',
//               status: 'Available',
//               imageUrl: 'https://www.gravatar.com/avatar/?d=mp',
//               doctor_number: 'Not assigned',
//               license_number: 'Not provided',
//               hpcsa_number: 'Not provided',
//               qualification: 'Medicine Degree and Master',
//               experience_years: 0,
//               consultation_fee: 0,
//               rating: 0.00,
//               total_reviews: 0,
//               languages: ['English'],
//               biography: 'No biography available',
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching doctor profile:', error);
//           setError('Failed to load profile data');
//           // Fallback to user metadata or email
//           const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
//           setDoctor({
//             name: `Dr ${fallbackName}`,
//             email: user.email,
//             phone_number: 'Not provided',
//             specialization: 'General Practitioner',
//             status: 'Available',
//             imageUrl: 'https://www.gravatar.com/avatar/?d=mp',
//             doctor_number: 'Not assigned',
//             license_number: 'Not provided',
//             hpcsa_number: 'Not provided',
//             qualification: 'Medicine Degree and Master',
//             experience_years: 0,
//             consultation_fee: 0,
//             rating: 0.00,
//             total_reviews: 0,
//             languages: ['English'],
//             biography: 'No biography available',
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchDoctorProfile();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//         <div className="text-center">
//           <div className="text-red-600 mb-4">{error}</div>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//       {/* Header Section */}
//       <div className="flex items-center space-x-6 mb-8">
//         <img
//           src={doctor.imageUrl}
//           alt="Doctor profile"
//           className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
//         />
//         <div className="flex-1">
//           <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
//           <p className="text-xl text-gray-600 mb-2">{doctor.specialization}</p>
//           <div className="flex items-center space-x-4">
//             <span
//               className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
//                 doctor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//               }`}
//             >
//               {doctor.status}
//             </span>
//             {/* <div className="flex items-center space-x-2">
//               <span className="text-yellow-500">★</span>
//               <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
//               <span className="text-gray-500">({doctor.total_reviews} reviews)</span>
//             </div> */}
//           </div>
//         </div>
//       </div>

//       {/* Contact Information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
//           <div className="space-y-2">
//             <div><strong>Email:</strong> {doctor.email}</div>
//             <div><strong>Phone:</strong> {doctor.phone_number}</div>
//             <div><strong>Doctor Number:</strong> {doctor.doctor_number}</div>
//           </div>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Details</h3>
//           <div className="space-y-2">
//             <div><strong>License Number:</strong> {doctor.license_number}</div>
//             <div><strong>HPCSA Number:</strong> {doctor.hpcsa_number}</div>
//             <div><strong>Experience:</strong> {doctor.experience_years} years</div>
//             <div><strong>Consultation Fee:</strong> R{doctor.consultation_fee}</div>
//           </div>
//         </div>
//       </div>

//       {/* Qualifications and Languages */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-blue-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">Qualifications</h3>
//           <p className="text-gray-700">{doctor.qualification}</p>
//         </div>

//         <div className="bg-green-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">Languages</h3>
//           <div className="flex flex-wrap gap-2">
//             {Array.isArray(doctor.languages) && doctor.languages.length > 0 ? (
//               doctor.languages.map((language, index) => (
//                 <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
//                   {language}
//                 </span>
//               ))
//             ) : (
//               <span className="text-gray-500">No languages specified</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Biography */}
//       <div className="mb-8">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">Biography</h3>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <p className="text-gray-700 leading-relaxed">{doctor.biography}</p>
//         </div>
//       </div>

//       {/* Action Button */}
//       <div className="flex justify-center">
//         <Link to="/dashboard/settings">
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
//             Edit Profile
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }





import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaClock, FaMoneyBill, FaGraduationCap, FaLanguage, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function DoctorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">No doctor information found.</p>
          <button 
            onClick={() => navigate("/UserDashboard?tab=doctors")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-red-600 hover:text-red-800 font-medium"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <img 
            src={doctor.avatar} 
            alt={doctor.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-red-100"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
          <p className="text-xl text-red-600 font-medium">{doctor.specialty}</p>
          
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{doctor.rating || 'No rating'}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600">{doctor.experience} years experience</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaMoneyBill className="text-red-600 mr-2" />
              <span className="font-medium">R{doctor.fee} per consultation</span>
            </div>
            
            <div className="flex items-center">
              <FaClock className="text-red-600 mr-2" />
              <span>30-60 minute sessions</span>
            </div>

            <div className="flex items-center">
              <FaGraduationCap className="text-red-600 mr-2" />
              <span>Board Certified</span>
            </div>

            <div className="flex items-center">
              <FaLanguage className="text-red-600 mr-2" />
              <span>English, Afrikaans</span>
            </div>
          </div>
        </div>
      </div>

      {doctor.biography && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About Dr. {doctor.name}</h2>
          <p className="text-gray-700 leading-relaxed">{doctor.biography}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-600 mr-2" />
              <span>123 Medical Center, Johannesburg</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-red-600 mr-2" />
              <span>+27 11 123 4567</span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-red-600 mr-2" />
              <span>dr.{doctor.name.toLowerCase().replace(' ', '.')}@mpilohospital.com</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>8:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span>9:00 AM - 1:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => navigate("/Userappointment", { state: { doctor } })}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Book Appointment
        </button>
        
        <button 
          onClick={() => navigate("/UserDashboard?tab=doctors")}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Back to Doctors List
        </button>
      </div>
    </div>
  );
}