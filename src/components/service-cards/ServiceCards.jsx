import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import ServiceTags from "../servicetags/serviceTags";

const ServiceCards = () => {
  return (
    <div className="relative px-6 py-16 md:py-24 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full z-0 opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,191,255,0.4), transparent 70%)',
        }}
      />
     
      
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-gray-800 font-sans text-lg leading-relaxed">
          <h2 className="text-3xl text-[#274D60] md:text-4xl font-bold mb-6">
            Transforming Healthcare with Mpilo Mobile
          </h2>
          <p className="mb-4">
            Mpilo Mobile delivers affordable, high-quality healthcare via pop-up clinics in under-resourced communities.
          </p>
          <p className="mb-4">
            Our services span general checkups, specialist care, and digital consultations, powered by telehealth and AI.
          </p>
          <p className="mb-6">
            This model cuts costs by up to 50% and delivers real-time health analytics to partners and stakeholders.
          </p>
          
          <a
            href="/about"
            className="mt-4 inline-flex items-center text-white text-[16px] bg-[#274D60] px-3 py-2 rounded-md hover:transition group"
          >
            <span className="flex items-center text-white gap-2 font-medium">
              Learn More
              <IoIosArrowRoundForward className="text-xl transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
            </span>
          </a>
        </div>
        
        <div className="flex justify-center">
          <img
            src="assets/images/home/tileImg-3.jpg"
            alt="Healthcare"
            className="w-full max-w-lg h-80 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
      <ServiceTags/>
    </div>
  );
};

export default ServiceCards;