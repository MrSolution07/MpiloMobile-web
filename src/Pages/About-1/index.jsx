import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import Cta from "../../Component/Cta/Cta";
import GotoTop from "../../Component/GotoTop";

function About1() {
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
        <Banner title="About Us" background="assets/images/aboutBanner.jpg"/>           
        <Cta />  
        <Footer />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default About1;
