import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import GotoTop from "../../Component/GotoTop";

function Services() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("grid");
  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
        <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
        <Banner title="Services" background="assets/images/banner4.webp" />
        <section className="why-us-section text-black py-5">
          <div className="container">
            <div className="row">

              <div className="col-12 text-center mb-4">
                <h2 className="fw-bold text-danger">Why Us?</h2>
              </div>

              <div className="col-md-10 offset-md-1 mb-5">
                <p className="text-center">
                  Our services cover a wide range of healthcare, including general health, optometry, dentistry, dietetics; specialist medicine such as ENT, cardio-metabolic & infectious diseases; and more. Mpilo Mobile leverages tele-health infrastructure to deliver medical consultations remotely and aftercare.
                </p>
                <p className="text-center">
                  Our healthcare delivery model delivers quality patient care at up to <strong>50% reduced cost</strong> compared to traditional health facilities, and we use artificial intelligence (AI) for triage & medical consultation purposes.
                </p>
                <p className="text-center">
                  Mpilo Mobile tracks the performance of our clinics and uses this insight to improve patient care with best-in-class data capture and analytics tools.
                </p>
              </div>

              <div className="col-12 text-center mb-4">
                <h3 className="fw-bold text-danger">Services</h3>
              </div>

              <div className="col-md-10 offset-md-1 d-flex flex-wrap justify-content-center gap-3 mb-5" style={{ gap: '1rem 2rem' }}>
                {["General Health", "Nutrition", "Vision", "Dental", "Cardio - Metabolic", "Optometry", "Dentistry", "ENT", "Respiratory"].map((tag, i) => (
                  <div key={i} className="px-4 py-2 border rounded-pill bg-light shadow-sm fw-medium">
                    {tag}
                  </div>
                ))}
              </div>

              <div className="col-lg-12 mb-5">
                <div className="row align-items-center g-5">

                  <div className="col-md-6">
                    <div className="overflow-hidden rounded-4 shadow-lg">
                      <img
                        src="assets/images/covid-services.jpg"
                        alt="COVID-19 Workplace Services"
                        className="img-fluid w-100"
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h4 className="fw-bold mb-3">COVID-19 Workplace Solutions</h4>
                    <ul className="list-unstyled ps-3">
                      <li className="mb-2">• Full Screening & Testing of Employees</li>
                      <li className="mb-2">• 96hr Results Turnaround</li>
                      <li className="mb-2">• COVID-19 Training for All Staff</li>
                      <li className="mb-2">• Hygiene Protocols Based on DoL Guidelines</li>
                      <li className="mb-2">• Employee Monitoring Tools (Manual & Digital)</li>
                      <li className="mb-2">• Workplace Readiness Report & Audit</li>
                      <li className="mb-2">• Hand & Personal Hygiene Practices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-80">"</div>
        <Footer getStart={true}/>
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Services;


