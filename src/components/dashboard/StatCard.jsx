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
  iconColor = 'text-blue-600',
}) => {
  return (
    <Link
      to={linkTo}
      className={`
        relative overflow-hidden rounded-lg ${cardColor} border shadow-sm
        transition-transform hover:shadow-md hover:-translate-y-1 duration-300
        flex flex-col justify-between
      `}
    >
      <div className="p-5 flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-500 text-xs sm:text-sm md:text-base">
            {title}
          </p>
          <p className="mt-1 font-semibold text-gray-900 text-2xl sm:text-3xl md:text-4xl">
            {value}
          </p>
        </div>
        <div
          className={`rounded-full p-2 flex items-center justify-center ${iconColor} bg-opacity-20`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center px-5 pb-4 text-xs sm:text-sm md:text-base">
          <span
            className={`flex items-center ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="mr-1 w-4 h-4" />
            ) : (
              <ArrowDownRight className="mr-1 w-4 h-4" />
            )}
            {trendValue}
          </span>
          <span className="ml-2 text-gray-500 whitespace-nowrap">
            from last week
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
    </Link>
  );
};

export default StatCard;
