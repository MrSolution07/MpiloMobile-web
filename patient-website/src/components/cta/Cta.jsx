import React from "react";

function Cta() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
         {/* Heading and Button */}
        <div className="text-left max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#274D60] leading-tight">
            <span className="text-[#274D60]">Empowering Health</span> with Mpilo Mobile
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-4xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "AI-Driven Triage",
              text: "Mpilo uses artificial intelligence to quickly assess and prioritize patients based on urgency. Our smart system analyzes symptoms and medical history to ensure critical cases receive immediate attention while optimizing resource allocation across all clinic locations.",
              top: true
            },
            {
              title: "Pop-Up Clinics",
              text: "Mobile clinics deliver care directly to communities with limited access to traditional facilities. Our fully equipped units bring comprehensive healthcare services right to your doorstep, eliminating transportation barriers and making quality care accessible to everyone.",
              bottom: true
            },
            {
              title: "Telehealth Access",
              text: "Book virtual doctor visits and follow-ups right from your device — no waiting rooms. Connect with healthcare professionals instantly, receive prescriptions digitally, and access your medical records anytime, anywhere through our secure telehealth platform.",
              top: true
            },
            {
              title: "Real-Time Data",
              text: "Monitor clinic impact and performance with advanced analytics and live dashboards. Track patient outcomes, resource utilization, and community health trends to make informed decisions and continuously improve healthcare delivery effectiveness.",
              bottom: true
            },
            {
              title: "Affordable Healthcare",
              text: "Reduce patient costs by up to 50% while delivering excellent medical care and insights. Our efficient model eliminates overhead costs of traditional facilities, passing savings directly to patients while maintaining the highest standards of care and service quality.",
              top: true
            }
          ].map((card, index) => (
            <div
              key={index}
              className="relative bg-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 min-h-[280px] flex flex-col justify-between"
            >
              {card.top && (
                <div
                  className="absolute w-[220px] h-[140px] "
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    top: "-30px",
                    left: "-180px",
                    transform: "rotate(-15deg)",
                  }}
                ></div>
              )}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-[#274D60] mb-4 leading-tight">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">{card.text}</p>
              </div>
              {card.bottom && (
                <div
                  className="absolute w-[220px] h-[140px]"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    bottom: "-30px",
                    right: "-160px",
                    transform: "rotate(15deg)",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-24"></div>
    </section>
  );
}

export default Cta;