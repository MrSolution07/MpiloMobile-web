// the footer we will be using
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function Footer({ getStart }) {
  return (
    <footer className={`footer-1 ${!getStart && "pd-top-90"}`}>
      <div className="container">
        {getStart && (
          <div className="row">
            <div className="col-md-12">
              <div className="cta-wrapper">
                <h3>Get the app today!</h3>
                <div className="store-buttons">
                  <a href="#" className="store-btn">
                    <img src="/assets/images/icons/appleLogo.png" alt="App Store" /> 
                    <span>Download on the <strong>App Store</strong></span>
                  </a>
                  <a href="#" className="store-btn">
                    <img src="/assets/images/icons/playStore.png" alt="Google Play" /> 
                    <span>Get it on <strong>Google Play</strong></span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-4 col-md-3">
            <aside className="widget">
              <div className="about-widget">
                <Link to="/">
                  <img src="assets/images/mpiloLogo.png" alt="" />
                </Link>
                <p>
                Mpilo Mobile delivers affordable, high-quality healthcare to communities using mobile clinics and smart tech. Follow us for real impact in African healthcare.

                </p>
                <div className="ab-social">
                  <a className="fac" >
                    <i className="social_facebook"></i>
                  </a>
                  <a className="twi" >
                    <i className="social_twitter"></i>
                  </a>
                  <a className="you" >
                    <i className="social_youtube"></i>
                  </a>
                  
                </div>
              </div>
            </aside>
          </div>
          <div className="col-lg-3 col-md-3">
            <aside className="widget">
              <h3 className="widget-title">Home</h3>
              <ul>
                <li>
                  <Link to="/about-1">About Us</Link>
                </li>         
                <li>
                  <Link to="#">Our Clients</Link>
                </li>
                <li>
                  <Link to="#">Gallery</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </aside>
          </div>
          <div className="col-lg-3 col-md-3">
            <aside className="widget">
              <h3 className="widget-title">Services</h3>
              <ul>
                <li>
                  <Link to="/course-3">Our Services</Link>
                </li>
                <li>
                  <Link to="#">Covid19 Services</Link>
                </li>
                <li>
                  <Link to="#">Digital Marketing</Link>
                </li>                
              </ul>
            </aside>
          </div>
          <div className="col-lg-2 col-md-3">
            <aside className="widget">
              <h3 className="widget-title">Support</h3>
              <ul>
                <li>
                  <Link to="#">info@mpilomobile.co.za</Link>
                </li>
                <li>
                  <Link to="#">(011) 881 5434</Link>
                </li>          
              </ul>
            </aside>
          </div>
        </div>
        {/* Copyrigh  */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="copyright">
              <p>
                © 2025 Copyright all Right Reserved Design by{" "}
                <a href="/about-1">Major Tech</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  getStart: ProtoTypes.bool,
};

export default Footer;
