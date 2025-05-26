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
            <p className="font-medium text-gray-500 text-sm">{title}</p>
            <p className="mt-1 font-semibold text-gray-900 text-3xl">{value}</p>
          </div>
          <div className={`rounded-full p-2 ${cardColor}`}>
            {icon}
          </div>
        </div>

        {trend && (
          <div className="flex items-center mt-3 text-sm">
            <span className={`
              flex items-center
              ${trend === 'up' ? 'text-green-600' : 'text-red-600'}
            `}>
              {trend === 'up' ? (
                <ArrowUpRight className="mr-1 w-4 h-4" />
              ) : (
                <ArrowDownRight className="mr-1 w-4 h-4" />
              )}
              {trendValue}
            </span>
            <span className="ml-2 text-gray-500">from last week</span>
          </div>
        )}
      </div>

      <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-r from-blue-500 to-purple-500 h-1"></div>
    </Link>
  );
};

export default StatCard;
