import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Heart, Search, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';
import { recipeAPI } from '../api/recipes';

interface WelcomeSectionProps {
  onQuickSearch: (ingredient: string) => void;
  onRecipeClick: (recipeId: string) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onQuickSearch, onRecipeClick }) => {
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  
  const quickIngredients = ['chicken', 'pasta', 'salmon', 'beef', 'rice', 'eggs'];
  const moodBasedSuggestions = [
    { mood: 'Comfort Food', ingredient: 'cheese', icon: '🧀' },
    { mood: 'Healthy & Fresh', ingredient: 'salmon', icon: '🥗' },
    { mood: 'Quick & Easy', ingredient: 'pasta', icon: '⚡' },
    { mood: 'Hearty Meal', ingredient: 'beef', icon: '🥩' }
  ];

  useEffect(() => {
    const fetchFeaturedRecipe = async () => {
      const recipe = await recipeAPI.getRandomRecipe();
      setFeaturedRecipe(recipe);
    };
    fetchFeaturedRecipe();
  }, []);

  return (
    <div className="space-y-12">
      {/* Welcome Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
          <Sparkles className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">Welcome back, Taylor!</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          What's cooking
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> today</span>?
        </h2>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tell me what ingredients you have, and I'll help you create something amazing. 
          Perfect for busy professionals who want great meals without the hassle.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredient Quick Search */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Quick Ingredient Search</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            Got these common ingredients? Click to find recipes instantly.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {quickIngredients.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => onQuickSearch(ingredient)}
                className="px-3 py-2 bg-white hover:bg-orange-500 hover:text-white rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 capitalize hover:shadow-md"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        {/* Mood-Based Suggestions */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">What's your mood?</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            Let your cravings guide you to the perfect meal.
          </p>
          <div className="space-y-3">
            {moodBasedSuggestions.map((suggestion) => (
              <button
                key={suggestion.mood}
                onClick={() => onQuickSearch(suggestion.ingredient)}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-teal-500 hover:text-white rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-white">
                    {suggestion.mood}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Recipe */}
      {featuredRecipe && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src={featuredRecipe.strMealThumb}
                alt={featuredRecipe.strMeal}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium text-sm">Recipe of the day</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {featuredRecipe.strMeal}
              </h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                {featuredRecipe.strInstructions?.slice(0, 120)}...
              </p>
              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Ready in 30-45 min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
                  <span>{featuredRecipe.strCategory}</span>
                </div>
              </div>
              <button
                onClick={() => onRecipeClick(featuredRecipe.idMeal)}
                className="self-start bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
              >
                <span>View Recipe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};