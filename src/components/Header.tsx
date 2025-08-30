import React from 'react';
import { ChefHat, Heart, Clock, Search } from 'lucide-react';

interface HeaderProps {
  onShowFavorites: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onShowFavorites, favoritesCount }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Recipe Ideas</h1>
              <p className="text-sm text-gray-600">For busy professionals</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600">
              <Search className="h-4 w-4" />
              <span>Find recipes by ingredient</span>
            </div>
            
            <button
              onClick={onShowFavorites}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Favorites ({favoritesCount})
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};