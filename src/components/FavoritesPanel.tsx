import React from 'react';
import { X, Heart, Clock, Trash2 } from 'lucide-react';
import { FavoriteRecipe } from '../types';
import { getFavorites, removeFromFavorites } from '../utils';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeClick: (recipeId: string) => void;
  onFavoritesChange: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ 
  isOpen, 
  onClose, 
  onRecipeClick, 
  onFavoritesChange 
}) => {
  const favorites = getFavorites();

  const handleRemove = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    removeFromFavorites(recipeId);
    onFavoritesChange();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4 flex items-start justify-end">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[calc(100vh-4rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Favorites</h2>
                <p className="text-sm text-gray-600">{favorites.length} saved recipes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Heart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 text-sm">
                  Start exploring recipes and save your favorites by clicking the heart icon
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer transition-all duration-200"
                    onClick={() => onRecipeClick(favorite.id)}
                  >
                    <div className="flex space-x-3">
                      <img
                        src={favorite.image}
                        alt={favorite.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                          {favorite.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="bg-white px-2 py-1 rounded-md">
                            {favorite.category}
                          </span>
                          <span>Saved {formatDate(favorite.savedAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemove(e, favorite.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};