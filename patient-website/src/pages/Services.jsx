import { useEffect, useState } from "react";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Banner } from "../components/banner";
import { GotoTop } from "../components/goto-top";

function Services() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <Preloader />;

  const covidServices = [
    "Full Screening & Testing of Employees",
    "96hr Results Turnaround", 
    "COVID-19 Training for All Staff",
    "Hygiene Protocols Based on DoL Guidelines",
    "Employee Monitoring Tools (Manual & Digital)",
    "Workplace Readiness Report & Audit",
    "Hand & Personal Hygiene Practices"
  ];

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Services" background="assets/images/banner4.webp" />

      <section className="py-16 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4">
          {/* Why Us Section */}
          <div className="text-left mb-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#274D60] mb-6">Why Choose Us?</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p className="text-gray-700">
                Our comprehensive services cover a wide range of healthcare specialties, including general
                health, optometry, dentistry, dietetics, and specialist medicine
                like ENT, cardio-metabolic & infectious diseases.
              </p>
              <p className="text-gray-700">
                Mpilo Mobile leverages cutting-edge tele-health infrastructure for remote consultations
                and aftercare, reducing costs by up to <span className="font-bold text-[#D7261E]">50%</span> compared
                to traditional health facilities.
              </p>
              <p className="text-gray-700">
                We track clinic performance with top-tier analytics tools to continuously improve
                patient care and outcomes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-16">
            {["General Health", "Nutrition", "Vision", "Dental", "Cardio - Metabolic", "Optometry", "Dentistry", "ENT", "Respiratory"].map((tag, i) => (
              <span
                key={i}
                className="bg-white border-2 border-red-500 text-red-500 px-5 py-2 rounded-full shadow-md text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src="assets/images/covid-services.jpg"
                alt="COVID-19 Workplace Services"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="text-left">
              <h3 className="text-3xl font-bold text-[#274D60] mb-6">
                COVID-19 Workplace Solutions
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Comprehensive workplace safety solutions designed to protect your employees and maintain business continuity.
              </p>
              
              <div className="grid gap-4">
                {covidServices.map((service, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-5 shadow-md border-l-4 border-[#D7261E] hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#D7261E] rounded-full mr-4 flex-shrink-0"></div>
                      <p className="text-gray-800 font-medium text-left">{service}</p>
                    </div>
                  </div>
                ))}
              </div>

        
            </div>
          </div>
        </div>
      </section>

      <Footer getStart={true} />
      <GotoTop />
    </>
  );
}

export default Services;