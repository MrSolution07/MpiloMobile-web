import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer({ getStart }) {
  return (
    <footer
      className={`footer-1 ${!getStart && "pd-top-90"} bg-gray-900 text-white px-6 py-10 shadow-lg rounded-t-3xl`}
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {getStart && (
          <div className="flex flex-col items-center justify-between gap-6 bg-gray-50 p-6 rounded">
            <h3 className="text-m text-black font-bold">Get the app today!</h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <a
                href="#"
                className="store-btn flex items-center justify-center gap-2 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition w-full sm:w-auto"
              >
                <FaApple className="text-2xl" />
                <span>
                  Download on the <strong>App Store</strong>
                </span>
              </a>
              <a
                href="#"
                className="store-btn flex items-center justify-center gap-2 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition w-full sm:w-auto"
              >
                <FaGooglePlay className="text-xl" />
                <span>
                  Get it on <strong>Google Play</strong>
                </span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/">
              <img
                src="/assets/images/mpiloLogo.png"
                alt="Mpilo Mobile"
                className="h-16 md:h-20 mb-3" // Increased logo size
              />
            </Link>
            <p className="text-m text-base/7 tracking-wide text-left text-black">
              Mpilo Mobile delivers affordable, high-quality healthcare to communities using mobile clinics and smart tech. 
              Follow us for real impact in African healthcare.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com/MpiloMobile"
                className="text-gray-900 hover:text-[#508de1]"
              >
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="text-gray-900 hover:text-[#508de1]">
                <FaXTwitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/mpilo_mobile/"
                className="text-gray-900 hover:text-[#508de1]"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs text-[#D7261E] font-semibold mb-2">Home</h5>
            <ul className="space-y-1 text-sm text-black">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/clients" className="hover:text-white">
                  Our Clients
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs text-[#D7261E] font-semibold mb-2">
              Services
            </h5>
            <ul className="space-y-1 text-sm text-black">
              <li>
                <Link to="/services" className="">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="">
                  Covid19 Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs text-[#D7261E] font-semibold mb-2">
              Support
            </h5>
            <ul className="space-y-1 text-sm text-black">
              <li>
                <a href="#" className="hover:text-white">
                  info@mpilomobile.co.za
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  (011) 881 5434
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center border-t border-gray-700 pt-2 pb-4">
          <p className="text-xs text-gray-400">
            &copy; 2025 Copyright all Right Reserved. Design by{" "}
            <p className="text-[#508de1]">
              Major Tech
            </p>
          </p>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  getStart: ProtoTypes.bool,
};

export default Footer;
