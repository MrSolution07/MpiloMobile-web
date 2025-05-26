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
  }, [isLoading]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="Services" background="assets/images/banner4.webp" />
      <section className="py-5 text-black why-us-section">
        <div className="container">
          <div className="row">
            <div className="mb-4 text-center col-12">
              <h2 className="text-danger fw-bold">Why Us?</h2>
            </div>

            <div className="mb-5 col-md-10 offset-md-1">
              <p className="text-center">
                Our services cover a wide range of healthcare, including general
                health, optometry, dentistry, dietetics; specialist medicine
                such as ENT, cardio-metabolic & infectious diseases; and more.
                Mpilo Mobile leverages tele-health infrastructure to deliver
                medical consultations remotely and aftercare.
              </p>
              <p className="text-center">
                Our healthcare delivery model delivers quality patient care at
                up to <strong>50% reduced cost</strong> compared to traditional
                health facilities, and we use artificial intelligence (AI) for
                triage & medical consultation purposes.
              </p>
              <p className="text-center">
                Mpilo Mobile tracks the performance of our clinics and uses this
                insight to improve patient care with best-in-class data capture
                and analytics tools.
              </p>
            </div>

            <div className="mb-4 text-center col-12">
              <h3 className="text-danger fw-bold">Services</h3>
            </div>

            <div
              className="d-flex flex-wrap justify-content-center gap-3 mb-5 col-md-10 offset-md-1"
              style={{ gap: "1rem 2rem" }}
            >
              {[
                "General Health",
                "Nutrition",
                "Vision",
                "Dental",
                "Cardio - Metabolic",
                "Optometry",
                "Dentistry",
                "ENT",
                "Respiratory",
              ].map((tag, i) => (
                <div
                  key={i}
                  className="bg-light shadow-sm px-4 py-2 border rounded-pill fw-medium"
                >
                  {tag}
                </div>
              ))}
            </div>

            <div className="mb-5 col-lg-12">
              <div className="align-items-center row g-5">
                <div className="col-md-6">
                  <div className="shadow-lg rounded-4 overflow-hidden">
                    <img
                      src="assets/images/covid-services.jpg"
                      alt="COVID-19 Workplace Services"
                      className="w-100 img-fluid"
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="mb-3 fw-bold">COVID-19 Workplace Solutions</h4>
                  <ul className="ps-3 list-unstyled">
                    <li className="mb-2">
                      • Full Screening & Testing of Employees
                    </li>
                    <li className="mb-2">• 96hr Results Turnaround</li>
                    <li className="mb-2">• COVID-19 Training for All Staff</li>
                    <li className="mb-2">
                      • Hygiene Protocols Based on DoL Guidelines
                    </li>
                    <li className="mb-2">
                      • Employee Monitoring Tools (Manual & Digital)
                    </li>
                    <li className="mb-2">
                      • Workplace Readiness Report & Audit
                    </li>
                    <li className="mb-2">
                      • Hand & Personal Hygiene Practices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-80">"</div>
      <Footer getStart={true} />
      <GotoTop />
    </>
  );
}

export default Services;
