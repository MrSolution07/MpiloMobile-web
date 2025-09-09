import profile from "../../public/assets/images/profileImg.png";

// Mock Data, button and badge components
const currentUser = {
  id: "user-1",
  name: "Dr. Sarah Johnson",
  avatar: profile
};

const contacts = [
  {
    id: "user-2",
    name: "John Smith",
    avatar: profile,
    role: "Patient"
  },
  {
    id: "user-3", 
    name: "Dr. Mike Wilson",
    avatar: profile,
    role: "Colleague"
  },
  {
    id: "user-4",
    name: "Sarah Davis",
    avatar: profile,
    role: "Patient"
  }
];

// Avatar Component
const MessagesAvatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 md:w-8 md:h-8",
    md: "w-8 h-8 md:w-10 md:h-10", 
    lg: "w-10 h-10 md:w-12 md:h-12"
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=ef4444&color=fff`}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    </div>
  );
};

// Badge Component
const Badge = ({ text, variant = "default", size = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    danger: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800"
  };
  
  const sizes = {
    small: "px-1.5 py-0.5 text-xs md:px-2 md:py-1",
    default: "px-2 py-1 text-xs md:px-3 md:text-sm"
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {text}
    </span>
  );
};

// Button Component
const Button = ({ children, variant = "default", size = "default", icon, onClick, disabled, className = "", loading = false }) => {
  const variants = {
    default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    primary: "bg-red-600 text-white border-transparent hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200",
    danger: "bg-red-600 text-white border-transparent hover:bg-red-700",
    ghost: "bg-transparent text-gray-700 border-transparent hover:bg-gray-100"
  };
  
  const sizes = {
    xs: "px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm",
    sm: "px-2 py-1 text-sm md:px-3 md:py-1.5",
    default: "px-3 py-2 text-sm md:px-4 md:text-sm",
    lg: "px-4 py-2 text-sm md:px-6 md:py-3 md:text-base"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="mr-1 md:mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export { MessagesAvatar, Badge, Button, contacts, currentUser };
export default MessagesAvatar;