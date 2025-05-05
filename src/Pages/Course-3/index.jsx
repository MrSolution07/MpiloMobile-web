import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import { course } from "../../Data/course";
import FeatureCourseCard from "../../Component/Cards/FeatureCourseCard";
import { Link } from "react-router-dom";
import CourseListViewV2 from "../../Component/Cards/CourseListViewV2";
import LatestCourseCard from "../../Component/Cards/LatestCourseCard";
import FilterForm from "../../Component/Form/FilterForm";
import GotoTop from "../../Component/GotoTop";

function Course3() {
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
        <Banner title="Courses Grid" background="assets/images/banner4.webp" />
        <section className="why-us-section text-black py-5">
            <div className="container">
              <div className="row">

                <div className="col-lg-12 mb-4">
                  <h2 className="fw-bold mb-3">Why Choose Mpilo Mobile?</h2>
                  <p className="lead">
                    Our services cover a wide range of healthcare including general health, optometry, dentistry, dietetics, specialist medicine (ENT, cardio-metabolic & infectious diseases), and more. Mpilo Mobile leverages tele-health infrastructure to deliver medical consultations remotely and aftercare.
                  </p>
                </div>

                <div className="col-lg-12 mb-5">
                  <div className="service-tags">
                    {["Optometry", "Dentistry", "Nutrition", "General Health", "ENT", "Respiratory"].map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="col-lg-12 mb-5">
                  <div className="row align-items-start">

\                    <div className="col-md-6 mb-4 mb-md-0">
                      <div className="image-glow-box">
                        <img
                          src="assets/images/covid-services.jpg"
                          alt="COVID-19 Services"
                          className="img-fluid rounded-4 shadow-lg"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h4 className="text-blacke mb-3">COVID-19 Workplace Solutions</h4>
                      <ul className="covid-list">
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

              </div>
            </div>
          </section>


{/* 
        <section className="coursepage-section-2">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="toolbar-wrapper-2">
                  <ul className="toolbar-btn nav nav-tabs">
                    <li>
                      <a
                        className={activeView === "grid" ? "active" : ""}
                        onClick={() => setActiveView("grid")}
                        data-toggle="tab"
                      >
                        <i className="icon_grid-2x2"></i>Grid
                      </a>
                    </li>
                    <li style={{ marginLeft: "5px" }}>
                      <a
                        onClick={() => setActiveView("list")}
                        className={activeView === "list" ? "active" : ""}
                        data-toggle="tab"
                      >
                        <i className="icon_menu"></i>List
                      </a>
                    </li>
                  </ul>
                  <div className="sorting">
                    <p>Sort by:</p>
                    <select name="orderby" className="orderby">
                      <option value="menu_order" defaultValue="selected">
                        Default
                      </option>
                      <option value="new">Newest Course</option>
                      <option value="popular">Popular Course</option>
                      <option value="rating">Average Rating</option>
                      <option value="price">Low to High</option>
                      <option value="price-desc">High to Low</option>
                    </select>
                  </div>
                  <form className="search-box" method="post" action="#">
                    <input
                      type="search"
                      name="s"
                      placeholder="Search Courses..."
                    />
                    <button type="submit">
                      <i className="ti-search"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-9">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show in active"
                    style={{
                      display: "flex",
                      flexDirection: activeView === "list" && "column",
                      flexWrap: "wrap",
                      gap: activeView === "list" && "30px",
                    }}
                  >
                    <div className="row">
                      {course.map((item) =>
                        activeView === "grid" ? (
                          <FeatureCourseCard
                            course={item}
                            key={item.id}
                            className="feature-course-item-4"
                          />
                        ) : (
                          <CourseListViewV2 key={item.id} course={item} />
                        )
                      )}
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="SkillUplms-pagination">
                          <span className="current">01</span>
                          <a>02</a>
                          <a className="next">
                            next<i className="arrow_right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="course-sidebar">
                  <aside className="widget">
                    <h3 className="widget-title">Course Categories</h3>
                    <ul>
                      <li>
                        <Link to="">Web Design</Link>
                      </li>
                      <li>
                        <Link to="">Marketing</Link>
                      </li>
                      <li>
                        <Link to="">Frontend</Link>
                      </li>
                      <li>
                        <Link to="">IT &amp; Software</Link>
                      </li>
                      <li>
                        <Link to="">Photography</Link>
                      </li>
                      <li>
                        <Link to="">Technology</Link>
                      </li>
                      <li>
                        <Link to="">General</Link>
                      </li>
                    </ul>
                  </aside>
                  <aside className="widget widget-filter">
                    <h3 className="widget-title">Price Filter</h3>
                    <FilterForm />
                  </aside>
                  <aside className="widget">
                    <h3 className="widget-title">Latest Courses</h3>
                    <LatestCourseCard
                      img="assets/images/course/1.jpg"
                      name="Algorithims and Data Structures"
                      price="64.00"
                      offerPrice="46.00"
                    />
                    <LatestCourseCard
                      img="assets/images/course/2.jpg"
                      name="Fundamentals of UI Design"
                      price="76.00"
                      offerPrice="Free"
                    />
                    <LatestCourseCard
                      img="assets/images/course/3.jpg"
                      name="Front-End Development with React"
                      price="76.00"
                      offerPrice="R46"
                    />
                    <LatestCourseCard
                      img="assets/images/course/4.jpg"
                      name="Business Analytics and Economics."
                      price="94.00"
                      offerPrice="R74.00"
                    />
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <div className="mb-80">"</div>
        <Footer getStart={true}/>
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Course3;
