import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

// Debounced scroll hook to prevent jamming
function useWindowPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollPosition(window.pageYOffset);
  }, []);

  useEffect(() => {
    let timeoutId;
    
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  return scrollPosition;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Our Clients", path: "/clients" },
  { name: "Gallery", path: "/gallery" },
];

function Header({ className, logo, joinBtn }) {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const windowPosition = useWindowPosition();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`w-full ${
        className ? className : "header-01"
      }  ${
        windowPosition > 0 ? "fix-header" : ""
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <img
              src="/assets/images/mpiloLogo.png"
              alt="Sticky Logo"
              className="h-10 w-auto hidden sticky-logo"
            />
          </Link>

          <button
            className="lg:hidden text-gray-800 focus:outline-none"
            onClick={() => setActiveMobileMenu(!activeMobileMenu)}
            aria-label="Toggle Mobile Menu"
          >
            <i className={`fal ${activeMobileMenu ? "fa-times" : "fa-bars"} text-2xl`}></i>
          </button>

          <ul className="hidden lg:flex items-center space-x-6 font-[400] text-black text-[17px] font-sans">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={`hover:text-[#274D60] ${
                    isActive(link.path) ? "font-bold text-[#274D60]" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center space-x-4">
            {className !== "header-02" && (
              <Link
                to="/login"
                title="Login"
                className="px-4 py-2 tracking-wider text-sm font-semibold 
                text-[#274D60] border border-[#274D60] bg-transparent rounded-none 
                transition-all duration-300 ease-in-out 
                hover:rounded"
              >
                Login
              </Link>
            )}
            {joinBtn && (
              <Link
                to="/contact"
                className="px-4 py-2 flex items-center justify-center tracking-wider 
                h-10 text-sm font-semibold border-[#274D60] bg-[#274D60] 
                text-white rounded transition-all duration-300 hover:bg-white 
                hover:text-[#274D60] rounded-none hover: border border-[#274D60]"

              >
                Contact Us
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {activeMobileMenu && (
          <div className="lg:hidden mt-2 bg-gray-50 rounded-lg shadow-md px-4 py-4 space-y-2">
            <ul className="flex flex-col space-y-3 text-gray-700 font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`block hover:text-[#274D60] ${
                      isActive(link.path) ? "font-bold text-[#274D60]" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="space-y-4">
              {className !== "header-02" && (
                <Link
                  to="/login"
                  className="block text-[#274D60] font-medium"
                >
                  Login
                </Link>
              )}
              {joinBtn && (
                <Link
                  to="/contact"
                  className="block w-full px-4 py-2 text-center text-sm font-semibold border-[#274D60] bg-[#274D60] text-white rounded transition-all duration-300 hover:bg-white hover:text-[#274D60]"
                >
                  Contact Us
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
};

export default Header;