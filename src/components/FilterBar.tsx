import React from 'react';
import { Clock, Filter, Utensils } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  recipeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, recipeCount }) => {
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
  const timeRanges = ['Any time', 'Quick (15 min)', 'Medium (30 min)', 'Elaborate (1+ hr)'];
  const difficulties = ['Any level', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Refine your search</span>
        </div>
        <span className="text-sm text-gray-500">{recipeCount} recipes found</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meal Type */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Utensils className="h-4 w-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">Meal Type</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange({ ...filters, category })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.category === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Time */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-teal-500" />
            <label className="text-sm font-medium text-gray-700">Cooking Time</label>
          </div>
          <div className="space-y-2">
            {timeRanges.map((time) => (
              <button
                key={time}
                onClick={() => onFilterChange({ ...filters, timeRange: time })}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  filters.timeRange === time
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
            <label className="text-sm font-medium text-gray-700">Difficulty</label>
          </div>
          <div className="space-y-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onFilterChange({ ...filters, difficulty })}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  filters.difficulty === difficulty
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};