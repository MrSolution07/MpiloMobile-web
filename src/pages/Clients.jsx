
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

  const clientLogos = [
    { src: "/assets/images/absaLogo.png", name: "Absa Bank" },
    { src: "/assets/images/bridgestoneLogo.jpg", name: "Bridgestone" },
    { src: "/assets/images/dettolLogo.svg", name: "Dettol" },
    { src: "/assets/images/governmentLogo.png", name: "Government" },
    { src: "/assets/images/nkangalaLogo.png", name: "Nkangala" },
    { src: "/assets/images/NMCFLogo.png", name: "NMCF" },
    { src: "/assets/images/pfizerLogo.svg", name: "Pfizer" },
    { src: "/assets/images/picknpayLogo.png", name: "Pick n Pay" },
  ];

  if (isLoading) return <Preloader />;

  return (
    <>
      <style jsx>{`
        .clients-section {
          padding: 80px 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          color: #274D60;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(to right, #274D60, #D7261E);
          border-radius: 2px;
        }

        .section-description {
          font-size: 18px;
          color: #475569;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }

        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 60px;
        }

        .client-card {
          background: white;
          border-radius: 16px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(39, 77, 96, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(39, 77, 96, 0.1);
          position: relative;
          overflow: hidden;
        }

        .client-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #274D60, #D7261E);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .client-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(39, 77, 96, 0.15);
        }

        .client-card:hover::before {
          transform: scaleX(1);
        }

        .logo-container {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          padding: 10px;
          background: #f1f5f9;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .client-card:hover .logo-container {
          background: rgba(215, 38, 30, 0.08);
        }

        .client-logo {
          max-width: 100%;
          max-height: 60px;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.7);
          transition: all 0.3s ease;
        }

        .client-card:hover .client-logo {
          filter: grayscale(0%) opacity(1);
          transform: scale(1.05);
        }

        .client-name {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: #274D60;
          margin: 0;
        }


        @media (max-width: 768px) {
          .section-title {
            font-size: 36px;
          }
          
          .clients-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
          }
          
          .client-card {
            padding: 30px 20px;
          }
          
      
          .stat-number {
            font-size: 36px;
          }
        }

        @media (max-width: 480px) {
          .clients-grid {
            grid-template-columns: 1fr;
          }
          
        }
      `}</style>

      <Header logo="assets/images/mpiloLogo.png" joinBtn={true} />
      <Banner
        title="Shared Vision Partnerships"
        background="assets/images/clientsBanner.jpg"
      />
      
      <section className="clients-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Trusted Partners</h2>
            <p className="section-description">
              Mpilo Mobile works in partnership with the Department of Health,
              and we use a B2B business model that is funded through strategic
              partnerships in the private sector. Our healthcare delivery
              model delivers quality patient care at up to 50% reduced cost
              compared to traditional health facilities.
            </p>
          </div>

          <div className="clients-grid">
            {clientLogos.map((client, i) => (
              <div className="client-card" key={i}>
                <div className="logo-container">
                  <img
                    src={client.src}
                    alt={`${client.name} Logo`}
                    className="client-logo"
                  />
                </div>
                <h3 className="client-name">{client.name}</h3>
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
