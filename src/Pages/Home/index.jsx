import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import HomeHero from "../../Component/Heros/Home-hero";
import Feature from "../../Component/Features/Feature";
import ServiceCards from "../../Component/ServiceCards/ServiceCards"; 
import AppInfo from "../../Component/AppInfo/AppInfo";
import Footer from "../../Component/Footer/Footer";
import GotoTop from "../../Component/GotoTop";

function Home() {
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
        <HomeHero />
        <ServiceCards service={true} heading={true} />
        <Feature />
        <AppInfo /> 
        <Footer getStart={true} />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Home;
