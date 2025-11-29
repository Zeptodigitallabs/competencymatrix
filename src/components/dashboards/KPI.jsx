import React from 'react';

const KPI = ({ title, value, sub }) => {
  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-sm text-gray-400">{sub}</div>}
    </div>
  );
};

export default KPI;
