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

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Services" background="assets/images/banner4.webp" />

      <section className="py-16 bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4">
          {/* Why Us Section */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#274D60] mb-4">Why Us?</h2>
            <p className="mb-4">
              Our services cover a wide range of healthcare, including general
              health, optometry, dentistry, dietetics, and specialist medicine
              like ENT, cardio-metabolic & infectious diseases.
            </p>
            <p className="mb-4">
              Mpilo Mobile uses tele-health infrastructure for remote consultations
              and aftercare, reducing costs by up to <strong>50%</strong> compared
              to traditional health facilities.
            </p>
            <p>
              We track clinic performance with top-tier analytics tools to improve
              patient care.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {["General Health", "Nutrition", "Vision", "Dental", "Cardio - Metabolic", "Optometry", "Dentistry", "ENT", "Respiratory"].map((tag, i) => (
              <span
                key={i}
                className="bg-white border border-gray-300 px-4 py-2 rounded-full shadow-sm text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img
                src="assets/images/covid-services.jpg"
                alt="COVID-19 Workplace Services"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#274D60] mb-4">
                COVID-19 Workplace Solutions
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Full Screening & Testing of Employees</li>
                <li>96hr Results Turnaround</li>
                <li>COVID-19 Training for All Staff</li>
                <li>Hygiene Protocols Based on DoL Guidelines</li>
                <li>Employee Monitoring Tools (Manual & Digital)</li>
                <li>Workplace Readiness Report & Audit</li>
                <li>Hand & Personal Hygiene Practices</li>
              </ul>
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
