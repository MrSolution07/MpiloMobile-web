import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'medium',
  bordered = true,
  hoverable = false,
  onClick
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const classes = `
    bg-white rounded-lg shadow-sm
    ${bordered ? 'border border-gray-200' : ''}
    ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;