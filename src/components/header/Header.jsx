import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWindowPosition } from "../../hooks";

function Header({ className, logo, joinBtn, search }) {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const windowPosition = useWindowPosition();

  return (
    <header
      className={`w-full ${className ? className : "header-01"} sticky top-0 z-50 ${
        windowPosition > 0 && "fix-header animated fadeInDown"
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center py-4">
          <Link className="flex items-center space-x-2" to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <img
              className="h-10 w-auto hidden sticky-logo"
              src="assets/images/mpiloLogo.png"
              alt="Sticky Logo"
            />
          </Link>

          <button
            className="lg:hidden text-gray-800 focus:outline-none"
            onClick={() => setActiveMobileMenu(!activeMobileMenu)}
          >
            <i className={`fal ${activeMobileMenu ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>

          <ul className="hidden lg:flex items-center space-x-6 text-gray-700 font-medium">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/clients" className="hover:text-primary">Our Clients</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>

          <div className="hidden lg:flex items-center space-x-4">
            {className !== "header-02" && (
              <Link
                to="/login"
                className="rounded p-2"
                style={{ backgroundColor: "#D7261E", color: "#fff" }}
              >
                <i className="ti-user text-xl"></i>
              </Link>
            )}
            {joinBtn && (
              <Link
                to="/register"
                className="text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90"
                style={{ backgroundColor: "rgba(0, 128, 128, 0.603)" }}
              >
                Register
              </Link>
            )}
            {search && (
              <form className="relative" method="post" action="#">
                <input
                  type="search"
                  name="s"
                  placeholder="Search Courses..."
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500">
                  <i className="ti-search"></i>
                </button>
              </form>
            )}
          </div>
        </div>

        {activeMobileMenu && (
          <div className="lg:hidden mt-2 space-y-2 bg-gray-50 rounded-lg shadow-md px-4 py-4">
            <ul className="flex flex-col space-y-3 text-gray-700 font-medium">
              <li><Link to="/" className="block">Home</Link></li>
              <li><Link to="/about" className="block">About Us</Link></li>
              <li><Link to="/services" className="block">Services</Link></li>
              <li><Link to="/clients" className="block">Our Clients</Link></li>
              <li><Link to="/gallery" className="block">Gallery</Link></li>
              <li><Link to="/contact" className="block">Contact Us</Link></li>
            </ul>

            <div className="flex items-center justify-start space-x-4 mt-4">
              {className !== "header-02" && (
                <Link
                  to="/login"
                  className="rounded-full p-2"
                  style={{ backgroundColor: "#D7261E", color: "#fff" }}
                >
                  <i className="ti-user text-xl"></i>
                </Link>
              )}
              {joinBtn && (
                <Link
                  to="/register"
                  className="text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90"
                  style={{ backgroundColor: "rgba(0, 128, 128, 0.603)" }}
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.string,
  joinBtn: PropTypes.bool,
  search: PropTypes.bool,
};

export default Header;
