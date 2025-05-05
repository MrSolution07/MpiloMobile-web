//  content of the jobs 
import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import TeacherCard from "../../Component/Cards/TeacherCard";
import GotoTop from "../../Component/GotoTop";

function Instructor() {
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
        <Banner title="Shared Vison Patnersnips" background="assets/images/clientsBanner.jpg" />
        <section className="instructor-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="sec-title mb-15">
                  <span></span> Our Customers
                </h2>
                <p className="sec-desc text-center mb-50">
                Mpilo Mobile works in partnership with the Department of Health, and we use a B2B business model that is funded through strategic partnerships in the private sector. 
                Our healthcare delivery model delivers quality patient care at up to 50% reduced cost compared to traditional health facilities.
                </p>
              </div>
            </div>
            <div className="row">
              <TeacherCard
                teacher={{
                  img: "assets/images/customers.png",
                  name: "IBM",
                }}
              />

             
{/* 
              <TeacherCard
                teacher={{
                  img: "assets/images/home2/teacher/3.png",
                  name: "Tonga Digital",
                  subject: "Graphic Designer",
                }}
              /> */}
            </div>
          </div>
        </section>
        <Footer getStart={true} />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Instructor;
