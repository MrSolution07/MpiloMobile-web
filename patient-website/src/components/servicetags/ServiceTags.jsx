import React from "react";

const services = [
  { label: "Cardiology" },
  { label: "Radiology" },
  { label: "Dentistry" },
  { label: "Nutrition" },
  { label: "ENT" },
  { label: "Respiratory" },
  { label: "Vision" },
  { label: "Optometry" },
  { label: "General Health" },
];

const ServiceTags = () => {
  return (
    <div className="py-16 mt-20 px-6 md:px-10 rounded-2xl mt-12">
      <h3 className="text-center text-4xl md:text-5xl font-bold text-[#274D60] mb-4 tracking-wide relative inline-block w-full">
          Explore Our Specialties
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-[#274D60] to-[#D7261E] rounded-full"></div>
        </h3>
        <div className="mb-16"></div>
        
             
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="border-2 border-gray-100 rounded-xl p-6 md:p-8 min-h-[120px] flex items-center justify-center shadow-sm hover:shadow-lg hover:border-[#D7261E] hover:scale-105 transition-all duration-300 "
          >
            <p className="text-sm md:text-lg font-semibold text-[#274D60] text-center group-hover:text-[#D7261E] transition-colors duration-300">
              {service.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTags;