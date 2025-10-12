import { useEffect, useState } from "react";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { HomeHero } from "../components/hero";
import { Feature } from "../components/features";
import { ServiceCards } from "../components/service-cards";
import { AppInfo } from "../components/utils";
import { Footer } from "../components/footer";
import { GotoTop } from "../components/goto-top";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) return <Preloader />;

  return (
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

export default Home;
