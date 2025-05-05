import { Link } from "react-router-dom";

function Cta() {
  return (
    <section className="cta-section">
      <div className="container">
        

        <div className="cta-grid">
          
          <div className="cta-card">
            <div className="card-shape-top"></div>
            <h3 className="on-shape">AI-Driven Triage</h3>
            <p className="off-shape">
              Mpilo uses artificial intelligence to quickly assess and prioritize patients based on urgency.
            </p>
          </div>

          <div className="cta-card">
            <h3 className="off-shape">Pop-Up Clinics</h3>
            <p className="on-shape">
              Mobile clinics deliver care directly to communities with limited access to traditional facilities.
            </p>
            <div className="card-shape-bottom"></div>
          </div>

          <div className="cta-card">
            <div className="card-shape-top"></div>
            <h3 className="on-shape">Telehealth Access</h3>
            <p className="off-shape">
              Book virtual doctor visits and follow-ups right from your device — no waiting rooms.
            </p>
          </div>

          <div className="cta-card">
            <h3 className="off-shape">Real-Time Data</h3>
            <p className="on-shape">
              Monitor clinic impact and performance with advanced analytics and live dashboards.
            </p>
            <div className="card-shape-bottom"></div>
          </div>

          <div className="cta-card">
            <div className="card-shape-top"></div>
            <h3 className="on-shape">Affordable Healthcare</h3>
            <p className="off-shape">
              Reduce patient costs by up to 50% while delivering excellent medical care and insights.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-md-10 text-center cta-content-box">
            <h2 className="sec-title mb-4">
              <span>Empowering Health</span> with Mpilo Mobile
            </h2>
            <p className="cta-text">
              Mpilo Mobile delivers affordable, high-quality healthcare via pop-up clinics in rural, urban, and semi-urban under-resourced communities. Our services include general health, optometry, dentistry, dietetics, and specialist care like ENT and infectious diseases. 
              <br /><br />
              We leverage telehealth and AI for triage and consultation, reducing costs by up to 50% while supporting CSR goals and data-driven decisions.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-md-12 text-center">
            <Link to="/services" className="SkillUplms-btn mt-4">
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
