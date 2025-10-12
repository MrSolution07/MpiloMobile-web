import React from 'react';

const Table = ({
  children,
  className = '',
  striped = false,
  bordered = false,
  hoverable = false,
  compact = false,
}) => {
  const tableClasses = `
    min-w-full divide-y divide-gray-200
    ${bordered ? 'border border-gray-200' : ''}
    ${className}
  `;

  return (
    <div className="shadow-sm rounded-lg overflow-x-auto">
      <table className={tableClasses}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '', striped = false, hoverable = false }) => {
  const bodyClasses = `
    divide-y divide-gray-200 bg-white
    ${className}
  `;

  return (
    <tbody className={bodyClasses}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            striped: striped && index % 2 === 1,
            hoverable: hoverable,
          });
        }
        return child;
      })}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', striped = false, hoverable = false, onClick }) => {
  const rowClasses = `
    ${striped ? 'bg-gray-50' : 'bg-white'}
    ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <tr className={rowClasses} onClick={onClick}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', compact = false }) => {
  const cellClasses = `
    ${compact ? 'px-3 py-2' : 'px-6 py-4'}
    text-sm text-gray-700
    ${className}
  `;

  return (
    <td className={cellClasses}>
      {children}
    </td>
  );
};

export const TableHeaderCell = ({
  children,
  className = '',
  compact = false,
  sortable = false,
  sorted = null,
  onClick
}) => {
  const cellClasses = `
    ${compact ? 'px-3 py-2' : 'px-6 py-3'}
    text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
    ${className}
  `;

  return (
    <th className={cellClasses} onClick={sortable ? onClick : undefined}>
      <div className="flex items-center">
        {children}
        {sortable && (
          <span className="flex-none ml-1 rounded">
            {sorted === 'asc' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : sorted === 'desc' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
};

export default Table;
