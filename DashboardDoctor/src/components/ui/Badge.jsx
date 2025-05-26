import React from 'react';

const Badge = ({ 
  text, 
  variant = 'neutral',
  size = 'medium' 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full";
  
  const variantClasses = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800",
    neutral: "bg-gray-100 text-gray-800"
  };
  
  const sizeClasses = {
    small: "text-xs px-2 py-0.5",
    medium: "text-xs px-2.5 py-1",
    large: "text-sm px-3 py-1.5"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  
  return (
    <span className={classes}>
      {text}
    </span>
  );
};

export default Badge;