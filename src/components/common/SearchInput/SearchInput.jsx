import React from 'react';

const SearchInput = ({ 
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  inputClassName = '',
  iconClassName = ''
}) => {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:ring-[#03045E] focus:border-transparent ${inputClassName}`}
        value={value}
        onChange={onChange}
      />
      <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${iconClassName}`}>
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default SearchInput;
