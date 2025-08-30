import React from 'react';
import { Recipe, FilterOptions } from '../types';
import { RecipeCard } from './RecipeCard';
import { estimateCookingTime, getDifficultyLevel } from '../utils';

interface RecipeGridProps {
  recipes: Recipe[];
  filters: FilterOptions;
  onRecipeClick: (recipeId: string) => void;
  onFavoriteToggle: () => void;
  isLoading: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  recipes, 
  filters, 
  onRecipeClick, 
  onFavoriteToggle,
  isLoading 
}) => {
  const filteredRecipes = recipes.filter(recipe => {
    // Category filter
    if (filters.category !== 'All' && recipe.strCategory !== filters.category) {
      return false;
    }

    // Time filter
    if (filters.timeRange !== 'Any time') {
      const cookingTime = estimateCookingTime(recipe.strInstructions || '');
      switch (filters.timeRange) {
        case 'Quick (15 min)':
          if (cookingTime > 15) return false;
          break;
        case 'Medium (30 min)':
          if (cookingTime > 30) return false;
          break;
        case 'Elaborate (1+ hr)':
          if (cookingTime < 60) return false;
          break;
      }
    }

    // Difficulty filter
    if (filters.difficulty !== 'Any level') {
      const difficulty = getDifficultyLevel(recipe);
      if (difficulty !== filters.difficulty) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredRecipes.length === 0 && recipes.length > 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes match your filters</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results</p>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to discover amazing recipes?</h3>
        <p className="text-gray-600">Search for ingredients you have on hand and let's cook something delicious!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          onClick={() => onRecipeClick(recipe.idMeal)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};