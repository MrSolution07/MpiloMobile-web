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
  iconColor,
}) => {
  return (
    <Link
      to={linkTo}
      className={`
        relative overflow-hidden rounded-lg ${cardColor} border border-gray-100 shadow-sm
        transition-transform hover:shadow-md hover:-translate-y-1 duration-300
        flex flex-col justify-between
      `}
    >
      <div className="p-3 flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-500 text-m">
            {title}
          </p>
          <p className="mt-0.5 font-semibold text-gray-900 text-xl sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`rounded-full p-1.5 flex items-center justify-center bg-opacity-20`}
          style={{ minWidth: '36px', minHeight: '36px' }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center px-3 pb-2 text-sm">
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

      <div className="absolute bottom-0 left-0 right-0 " />
    </Link>
  );
};

export default StatCard;