import { useEffect, useState } from "react";
import { Preloader } from "../components/preloader";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Banner } from "../components/banner";
import { GotoTop } from "../components/goto-top";

function Clients() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner
        title="Shared Vison Patnersnips"
        background="assets/images/clientsBanner.jpg"
      />
      <section className="instructor-section">
        <div className="container">
          <div className="row">
            <div className="text-center col-md-12">
              <h2 className="mb-15 sec-title">
                <span></span> Our Customers
              </h2>
              <p className="mb-50 text-center sec-desc">
                Mpilo Mobile works in partnership with the Department of Health,
                and we use a B2B business model that is funded through strategic
                partnerships in the private sector. Our healthcare delivery
                model delivers quality patient care at up to 50% reduced cost
                compared to traditional health facilities.
              </p>
            </div>
          </div>
          <div className="client-logos-container">
            {[
              "/assets/images/absaLogo.png",
              "/assets/images/bridgestoneLogo.jpg",
              "/assets/images/dettolLogo.svg",
              "/assets/images/governmentLogo.png",
              "/assets/images/nkangalaLogo.png",
              "/assets/images/NMCFLogo.png",
              "/assets/images/pfizerLogo.svg",
              "/assets/images/picknpayLogo.png",
            ].map((logo, i) => (
              <div className="logo-wrapper" key={i}>
                <img
                  src={logo}
                  alt={`Client Logo ${i + 1}`}
                  className="client-logo"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer getStart={true} />
      <GotoTop />
    </>
  );
}

export default Clients;
