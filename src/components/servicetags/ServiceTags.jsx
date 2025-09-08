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
    <div className="py-16 px-6 md:px-10 rounded-2xl mt-12">
      <h3 className="text-center text-3xl md:text-4xl font-bold text-[#274D60] mb-12">
        Explore Our Specialties
      </h3>
             
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white via-white-50 to-white-100 border-2 border-[#D7261E]/20 rounded-xl p-6 md:p-8 min-h-[120px] flex items-center justify-center shadow-sm hover:shadow-lg hover:border-[#D7261E] hover:bg-gradient-to-br hover:from-red-50 hover:to-gray-50 hover:scale-105 transition-all duration-300 cursor-pointer group"
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