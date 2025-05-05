// this is the one for home 1
import ProtoTypes from "prop-types";
import { IoIosArrowRoundForward } from "react-icons/io";
import CourseItemCard from "../Cards/CourseItemCard";

function PopularCourse({ course, heading }) {
  return (
    <section className="popular-course-section">
      <div className="container">
        {heading && (
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center mb-5 mt-5">
              <h2 className="sec-title">
                An Initiative <span>Dedicated to improving healthcare access
                <br /> and quality in Africa </span>
              </h2>
            </div>
          </div>
          
        )}
        {course && (
          <div className="row">
            <div className="col-lg-12">

            <div className="about-section">
              <div className="about-image"></div>
              
              <div className="about-description-wrapper">
              <p className="about-description">
                Mpilo Mobile delivers affordable, high-quality healthcare via pop-up clinics in rural, urban and semi-urban & under-resourced communities.<br /><br />
                Services range from general checkups to specialist care, supported by telehealth and AI tools.<br /><br /> 
                This model cuts costs by up to 50% and provides real-time data to partners through advanced analytics.
              </p>
              </div>

              <a className="SkillUplms-btn" href="/about-1">
                <span className="btn-content">
                  Learn More
                  <IoIosArrowRoundForward className="btn-arrow" />
                </span>
              </a>
            </div>


              <div className="course-wrapper">
                <CourseItemCard title="We are mobile" link="single-course"
                text="A primary mobile healthcare provider serving under-resourced communities in 3 African Countries.">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="74"
                    height="60"
                    viewBox="0 0 74 60"
                  >
                    <defs>
                      <pattern
                        id="pattern"
                        preserveAspectRatio="xMidYMid slice"
                        width="100%"
                        height="100%"
                        viewBox="0 0 74 60"
                      >
                        <image
                          width="74"
                          height="60"
                          xlinkHref="assets/images/home/clinic.png"
                        />

                      </pattern>
                    </defs>
                    
                    <path
                      id="desktop1"
                      className="cls-1"
                      style={{ fill: "url(#pattern)" }}
                      d="M0,0H74V60H0Z"
                    />

                  </svg>
                </CourseItemCard>
                <CourseItemCard
                  title="Founded in 2015"
                  link="single-course"
                  text="Mpilo Mobile was founded in 2015, by Tumi Mabitsela, who was a Nelson Mandela Washington Fellow."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                  >
                    <image
                      id="data"
                      width="64"
                      height="64"
                      xlinkHref="assets/images/home/flag.png"
                    />
                  </svg>
                </CourseItemCard>
                <CourseItemCard
                  title="3 Countries"
                  link="single-course"
                  text = "Our comprehensive primary healthcare services have been rolled out across 3 Countries in Africa"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="74"
                    height="70"
                    viewBox="0 0 74 70"
                  >
                    <image
                      id="proposal"
                      width="74"
                      height="70"
                      xlinkHref="assets/images/home/country.png"
                    />
                  </svg>
                </CourseItemCard>
                <CourseItemCard title="Our tech" link="single-course"
                text="Infrastructure, healthcare IT and point-of-care diagnostics to 3rd party clinics in the areas of operation."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="80"
                    height="67"
                    viewBox="0 0 80 67"
                  >
                    <image
                      id="chat"
                      width="80"
                      height="67"
                      xlinkHref="assets/images/home/tech.png"
                    />
                  </svg>
                </CourseItemCard>
                <CourseItemCard
                  title="Mulitiple Services"
                  link="single-course"
                  text="Consultations, dispensary, rapid test at point-of-care, dentistry, optometry, dietetics & more"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="58"
                    height="73"
                    viewBox="0 0 58 73"
                  >
                    <image
                      id="mind"
                      width="58"
                      height="73"
                      xlinkHref="assets/images/home/service.png"
                    />
                  </svg>
                </CourseItemCard>
                <CourseItemCard
                  title="Black Female-Owned"
                  link="single-course"
                  text="We are a level 1 BEE Company, Black female owned, and employ people from the Community we serve"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="58"
                    height="73"
                    viewBox="0 0 58 73"
                  >
                    <image
                      id="mind"
                      width="58"
                      height="73"
                      xlinkHref="assets/images/home/certificate.png"
                    />
                  </svg>
                </CourseItemCard>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

PopularCourse.propTypes = {
  course: ProtoTypes.bool,
  heading: ProtoTypes.bool,
};

export default PopularCourse;
