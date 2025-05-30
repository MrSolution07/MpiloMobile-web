import PropTypes from "prop-types";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ServiceCard } from "../cards";

function ServiceCards({ service, heading }) {
  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">

        {heading && (
          <div className="flex justify-center mb-10">
            <div className="text-center max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold leading-snug text-gray-800">
                An Initiative{" "}
                <span className="block text-[#274D60]">
                  Dedicated to improving healthcare access
                  <br /> and quality in Africa
                </span>
              </h2>
            </div>
          </div>
        )}

        {service && (
          <div className="relative p-8 mb-12 overflow-hidden">
            <div
              className="absolute top-0 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full z-0 opacity-20 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(0,191,255,0.4), transparent 70%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 translate-y-1/2 w-[400px] h-[400px] rounded-full z-0 opacity-20 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(0,191,255,0.4), transparent 70%)',
              }}
            />

            <div className="relative z-10 mb-6">
              <div className="flex justify-center mb-8">
                <img
                  src="/assets/images/home/homePicture.png"
                  alt="Mpilo Home"
                  className="w-full max-w-4xl rounded-lg shadow-md object-cover"
                />
              </div>

              {/* Text */}
              <p className="text-lg text-gray-700 text-center leading-relaxed">
                Mpilo Mobile delivers affordable, high-quality healthcare
                via pop-up clinics in rural, urban and semi-urban & under-resourced communities.
                <br /><br />
                Services range from general checkups to specialist care, supported by telehealth and AI tools.
                <br /><br />
                This model cuts costs by up to 50% and provides real-time data to partners through advanced analytics.
              </p>
            </div>

            <a
              href="/about"
              className="relative z-10 inline-flex items-center text-white bg-black px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                Learn More
                <IoIosArrowRoundForward className="text-xl" />
              </span>
            </a>
          </div>
        )}

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <ServiceCard
            title="We are mobile"
            link="#"
            text="A primary mobile healthcare provider serving under-resourced communities in 3 African Countries."
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/clinic.png"
                alt="clinic"
                className="w-14 h-14 object-contain"
              />
            </div>
          </ServiceCard>

          <ServiceCard
            title="Founded in 2015"
            link="#"
            text="Mpilo Mobile was founded in 2015, by Tumi Mabitsela, who was a Nelson Mandela Washington Fellow."
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/flag.png"
                alt="flag"
                className="w-12 h-12 object-contain"
              />
            </div>
          </ServiceCard>

          <ServiceCard
            title="3 Countries"
            link="#"
            text="Our comprehensive primary healthcare services have been rolled out across 3 Countries in Africa"
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/country.png"
                alt="country"
                className="w-14 h-14 object-contain"
              />
            </div>
          </ServiceCard>

          <ServiceCard
            title="Our tech"
            link="#"
            text="Infrastructure, healthcare IT and point-of-care diagnostics to 3rd party clinics in the areas of operation."
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/tech.png"
                alt="tech"
                className="w-14 h-14 object-contain"
              />
            </div>
          </ServiceCard>

          <ServiceCard
            title="Mulitiple Services"
            link="#"
            text="Consultations, dispensary, rapid test at point-of-care, dentistry, optometry, dietetics & more"
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/service.png"
                alt="service"
                className="w-12 h-16 object-contain"
              />
            </div>
          </ServiceCard>

          <ServiceCard
            title="Black Female-Owned"
            link="#"
            text="We are a level 1 BEE Company, Black female owned, and employ people from the Community we serve"
          >
            <div className="flex justify-center mb-4">
              <img
                src="assets/images/home/certificate.png"
                alt="certificate"
                className="w-12 h-16 object-contain"
              />
            </div>
          </ServiceCard>
        </div>
      </div>
    </section>
  );
}

ServiceCards.propTypes = {
  service: PropTypes.bool,
  heading: PropTypes.bool,
};

export default ServiceCards;
   