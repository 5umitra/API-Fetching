import React, { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { getSearchHistory, saveSearchHistory } from '../utils';

interface SearchBarProps {
  onSearch: (ingredient: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [ingredient, setIngredient] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      saveSearchHistory(ingredient.trim());
      setSearchHistory(getSearchHistory());
      onSearch(ingredient.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historicalIngredient: string) => {
    setIngredient(historicalIngredient);
    onSearch(historicalIngredient);
    setShowHistory(false);
  };

  const quickSuggestions = ['chicken', 'beef', 'pasta', 'rice', 'salmon', 'eggs', 'cheese', 'tomato'];

  useEffect(() => {
    const handleClickOutside = () => setShowHistory(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="What ingredients do you have? (e.g., chicken, tomato, rice)"
            className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !ingredient.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search History and Suggestions */}
      {showHistory && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {searchHistory.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Clock className="h-4 w-4" />
                <span>Recent searches</span>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.timestamp}
                    onClick={() => handleHistoryClick(item.ingredient)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group"
                  >
                    <span className="text-gray-700">{item.ingredient}</span>
                    <X className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Popular ingredients</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleHistoryClick(suggestion)}
                  className="text-left px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors duration-150 text-gray-700 capitalize"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};