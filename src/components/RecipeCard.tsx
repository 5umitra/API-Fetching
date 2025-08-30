import React from 'react';
import { Clock, Users, Heart, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { estimateCookingTime, getDifficultyLevel, isFavorite, saveToFavorites, removeFromFavorites } from '../utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onFavoriteToggle?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, onFavoriteToggle }) => {
  const cookingTime = estimateCookingTime(recipe.strInstructions || '');
  const difficulty = getDifficultyLevel(recipe);
  const isRecipeFavorite = isFavorite(recipe.idMeal);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRecipeFavorite) {
      removeFromFavorites(recipe.idMeal);
    } else {
      saveToFavorites(recipe);
    }
    onFavoriteToggle?.();
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              isRecipeFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
            }`} 
          />
        </button>
        
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700">
            {recipe.strCategory}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {recipe.strMeal}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{cookingTime} min</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ChefHat className="h-4 w-4" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {recipe.strArea && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
            <span>{recipe.strArea} cuisine</span>
          </div>
        )}
      </div>
    </div>
  );
};