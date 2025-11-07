import React from 'react';

const IconGrid = () => (
  <div className="grid grid-cols-4 gap-4 mb-8">
    {[1, 2, 3, 4, 5].map((level) => (
      <div key={level} className="text-center p-4 bg-white rounded-lg shadow">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-blue-600 font-bold">{level}</span>
        </div>
        <div className="text-xs text-gray-500">Level {level}</div>
      </div>
    ))}
  </div>
);

export default IconGrid;
