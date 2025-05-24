import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import ContactForm from "../../Component/Form/ContactForm";
import Map from "../../Component/Map";
import GotoTop from "../../Component/GotoTop";

function Contact() {
  const [isLoading, setIsLoading] = useState(true);
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
        <Banner title="Contact Us" background="assets/images/contactBanner.jpg" />
        <section className="contact-section">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="contact--info-area">
                  <h3>Get in touch</h3>
                  <p>
                    Looking for help? Get in touch with us.
                  </p>
                  <div className="single-info">
                    <h5>Headquaters</h5>
                    <p>
                      <i className="icon_house_alt"></i>
                      2nd Floor, West Tower, Nelson Mandela Square,
                      Maude Street, Sandton, 2196
                      <br /> Johannesburg, SA
                    </p>
                  </div>
                  <div className="single-info">
                    <h5>Phone</h5>
                    <p>
                      <i className="icon_phone"></i>
                      (011) 881 5434
                    </p>
                  </div>
                  <div className="single-info">
                    <h5>Support</h5>
                    <p>
                      <i className="icon_mail_alt"></i>
                      info@mpilomobile.co.za
                     
                    </p>
                  </div>
                  <div className="ab-social">
                    <h5>Follow Us</h5>
                    <a className="fac" href="https://www.facebook.com/MpiloMobile">
                      <i className="social_facebook"></i>
                    </a>
                    <a className="twi" href="#">
                      <i className="social_twitter"></i>
                    </a>
                    <a className="insta" href="https://www.instagram.com/mpilo_mobile/">
                      <i className="social_instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="contact-form">
                  <h4>Let's Connect</h4>
                  <p>
                    Fill out your details
                  </p>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        <Map />
        <Footer />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Contact;
