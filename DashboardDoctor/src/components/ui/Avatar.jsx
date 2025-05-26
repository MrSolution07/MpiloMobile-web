import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md',
  status,
  className = ''
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5'
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium border border-blue-200`}>
          {getInitials(alt)}
        </div>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColors[status]} ${statusSizes[size]}`}></span>
      )}
    </div>
  );
};

export default Avatar;