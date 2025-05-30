import { Link } from "react-router-dom";

function Cta() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Heading and Button */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[#274D60]">
            <span className="text-[#6BA3BE]">Empowering Health</span> with Mpilo Mobile
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Mpilo Mobile delivers affordable, high-quality healthcare via
            pop-up clinics in rural, urban, and semi-urban under-resourced
            communities. Our services include general health, optometry,
            dentistry, dietetics, and specialist care like ENT and infectious
            diseases.
            <br />
            <br />
            We leverage telehealth and AI for triage and consultation,
            reducing costs by up to 50% while supporting CSR goals and
            data-driven decisions.
          </p>
        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Driven Triage",
              text: "Mpilo uses artificial intelligence to quickly assess and prioritize patients based on urgency.",
              top: true
            },
            {
              title: "Pop-Up Clinics",
              text: "Mobile clinics deliver care directly to communities with limited access to traditional facilities.",
              bottom: true
            },
            {
              title: "Telehealth Access",
              text: "Book virtual doctor visits and follow-ups right from your device — no waiting rooms.",
              top: true
            },
            {
              title: "Real-Time Data",
              text: "Monitor clinic impact and performance with advanced analytics and live dashboards.",
              bottom: true
            },
            {
              title: "Affordable Healthcare",
              text: "Reduce patient costs by up to 50% while delivering excellent medical care and insights.",
              top: true
            },
          ].map((card, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden"
            >
              {card.top && (
                <div
                  className="absolute w-[200px] h-[120px] bg-[#6BA3BE] z-0"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    top: "-20px",
                    left: "-160px",
                    transform: "rotate(-10deg)",
                  }}
                ></div>
              )}
              <h3 className="relative text-xl font-semibold text-[#274D60] mb-2 z-10">
                {card.title}
              </h3>
              <p className="relative text-gray-700 z-10">{card.text}</p>
              {card.bottom && (
                <div
                  className="absolute w-[200px] h-[120px] bg-[#6BA3BE] z-0"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    bottom: "-20px",
                    right: "-140px",
                    transform: "rotate(10deg)",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20"></div>
    </section>
  );
}

export default Cta;
