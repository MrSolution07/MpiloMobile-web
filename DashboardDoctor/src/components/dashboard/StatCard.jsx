import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  linkTo,
  cardColor = 'bg-white',
  iconColor = 'text-blue-600'
}) => {
  return (
    <Link 
      to={linkTo} 
      className={`
        relative overflow-hidden rounded-lg ${cardColor} border shadow-sm 
        transition-transform hover:shadow-md hover:-translate-y-1 duration-300
      `}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`rounded-full p-2 ${cardColor}`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center text-sm">
            <span className={`
              flex items-center
              ${trend === 'up' ? 'text-green-600' : 'text-red-600'}
            `}>
              {trend === 'up' ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {trendValue}
            </span>
            <span className="ml-2 text-gray-500">from last week</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
    </Link>
  );
};

export default StatCard;