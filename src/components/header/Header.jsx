import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ChevronDown, Stethoscope, UserCog } from "lucide-react";

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

function Header({ className, logo, joinBtn, user }) {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const windowPosition = useWindowPosition();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownOpen && !event.target.closest('.login-dropdown')) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loginDropdownOpen]);

  return (
    <header
      className={`w-full ${className ? className : "header-01"}  ${windowPosition > 0 ? "fix-header" : ""}`}
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
                  className={`hover:text-red-600 ${
                    isActive(link.path) ? "font-bold text-red-600" : ""
                  } rounded-[0.8rem]`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center space-x-4">
            {className !== "header-02" && (
              <div className="relative login-dropdown">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-4xl  border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-black hover:bg-gray-50 transition-colors"
                  style={{ minWidth: 40, minHeight: 40 }}
                  title="Login Options"
                >
                  <User className="w-6 h-6" />
                </button>
                
                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setLoginDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Patient Login
                      </Link>
                      <Link
                        to="/doctorlogin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setLoginDropdownOpen(false)}
                      >
                        <Stethoscope className="w-4 h-4 mr-3" />
                        Doctor Login
                      </Link>
                      <Link
                        to="/adminlogin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                        onClick={() => setLoginDropdownOpen(false)}
                      >
                        <UserCog className="w-4 h-4 mr-3" />
                        Admin Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {joinBtn && (
              <Link
                to="/contact"
                className="px-4 py-2 flex items-center justify-center tracking-wider 
                h-10 text-sm font-semibold border border-red-500 bg-red-500 
                text-white transition-all duration-300 hover:bg-white 
                hover:text-red-500 rounded-[0.8rem]"
              >
                Contact Us
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {activeMobileMenu && (
          <div className="lg:hidden mt-2 bg-gray-50 rounded-[0.8rem] shadow-md px-4 py-4 space-y-2">
            <ul className="flex flex-col space-y-3 text-gray-700 font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`block hover:text-red-600 ${
                      isActive(link.path) ? "font-bold text-red-600" : ""
                    } rounded-[0.8rem]`}
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
                  className="w-10 h-10 flex items-center justify-center mx-auto rounded-4xl  border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                  style={{ minWidth: 40, minHeight: 40 }}
                >
                  <User className="w-6 h-6" />
                </Link>
              )}
              {joinBtn && (
                <Link
                  to="/contact"
                  className="block w-full px-4 py-2 text-center text-sm font-semibold border border-red-500 bg-red-500 text-white rounded-[0.8rem] transition-all duration-300 hover:bg-white hover:text-red-500"
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