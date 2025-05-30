import { useEffect, useState } from "react";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Banner } from "../components/banner";
import { Cta } from "../components/cta";
import { GotoTop } from "../components/goto-top";

function About() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner title="About Us" background="assets/images/aboutBanner.jpg" />
      <Cta />
      <Footer getStart={true}/>
      <GotoTop />
    </>
  );
}

export default About;
