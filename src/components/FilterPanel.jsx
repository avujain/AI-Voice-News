import React from 'react';

const FilterPanel = ({ filters, currentFilter, onFilterChange }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-600">
      <h3 className="text-white font-semibold mb-3 text-center">Filters</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex-shrink-0 relative group ${
              currentFilter === filter.value ? 'ring-2 ring-pink-400' : ''
            }`}
          >
            {/* Filter Preview */}
            <div
              className={`w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600 ${
                filter.value !== 'none' ? 'opacity-80' : ''
              }`}
              style={{
                filter: filter.style || 'none',
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"></div>
            </div>

            {/* Filter Name */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span
                className={`text-xs px-2 py-1 rounded-full transition-all ${
                  currentFilter === filter.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-black/50 text-gray-300 group-hover:bg-gray-700'
                }`}
              >
                {filter.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
