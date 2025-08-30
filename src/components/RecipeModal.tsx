import React, { useEffect, useState } from 'react';
import { X, Clock, ChefHat, MapPin, ExternalLink, Heart, Users } from 'lucide-react';
import { Recipe } from '../types';
import { parseIngredients, estimateCookingTime, getDifficultyLevel, isFavorite, saveToFavorites, removeFromFavorites } from '../utils';
import { recipeAPI } from '../api/recipes';

interface RecipeModalProps {
  recipeId: string;
  onClose: () => void;
  onFavoriteToggle?: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipeId, onClose, onFavoriteToggle }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const isRecipeFavorite = recipe ? isFavorite(recipe.idMeal) : false;

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const data = await recipeAPI.getRecipeDetails(recipeId);
      setRecipe(data);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  const handleFavoriteClick = () => {
    if (!recipe) return;
    
    if (isRecipeFavorite) {
      removeFromFavorites(recipe.idMeal);
    } else {
      saveToFavorites(recipe);
    }
    onFavoriteToggle?.();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-gray-600">Recipe not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  const ingredients = parseIngredients(recipe);
  const cookingTime = estimateCookingTime(recipe.strInstructions);
  const difficulty = getDifficultyLevel(recipe);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4 flex items-start justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleFavoriteClick}
              className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
            >
              <Heart 
                className={`h-5 w-5 transition-colors duration-200 ${
                  isRecipeFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {recipe.strMeal}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-700">
                  {recipe.strCategory}
                </span>
                {recipe.strArea && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {recipe.strArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Recipe Info */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">{cookingTime} min</div>
                <div className="text-sm text-gray-600">Cook time</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <ChefHat className="h-6 w-6 text-teal-500 mx-auto mb-2" />
                <div className={`text-lg font-semibold px-3 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">4-6</div>
                <div className="text-sm text-gray-600">Servings</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                <div className="space-y-3">
                  {ingredients.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.ingredient}</span>
                        {item.measure && (
                          <span className="text-gray-600 ml-2">({item.measure})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                <div className="prose prose-gray max-w-none">
                  {recipe.strInstructions.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-700 mb-3 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(recipe.strTags || recipe.strYoutube) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {recipe.strTags && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.strTags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {recipe.strYoutube && (
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Watch Video</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};