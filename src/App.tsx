import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeModal } from './components/RecipeModal';
import { FavoritesPanel } from './components/FavoritesPanel';
import { WelcomeSection } from './components/WelcomeSection';
import { Recipe, FilterOptions } from './types';
import { recipeAPI } from './api/recipes';
import { getFavorites } from './utils';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(getFavorites().length);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    timeRange: 'Any time',
    difficulty: 'Any level'
  });

  const handleSearch = async (ingredient: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentIngredient(ingredient);
    
    try {
      const results = await recipeAPI.searchByIngredient(ingredient);
      setRecipes(results);
    } catch (error) {
      console.error('Search failed:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    setFavoritesCount(getFavorites().length);
  };

  const handleRecipeClick = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setShowFavorites(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onShowFavorites={() => setShowFavorites(true)}
        favoritesCount={favoritesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Welcome Section (show when no search has been made) */}
        {!hasSearched && (
          <WelcomeSection 
            onQuickSearch={handleSearch}
            onRecipeClick={handleRecipeClick}
          />
        )}

        {/* Results Section (show after search) */}
        {hasSearched && (
          <div className="space-y-8">
            {/* Search Results Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recipes with <span className="text-orange-600">{currentIngredient}</span>
              </h2>
              <p className="text-gray-600">
                Discovered {recipes.length} delicious recipes for your cooking adventure
              </p>
            </div>

            {/* Filters */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              recipeCount={recipes.length}
            />

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={recipes}
              filters={filters}
              onRecipeClick={handleRecipeClick}
              onFavoriteToggle={handleFavoriteToggle}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onRecipeClick={handleRecipeClick}
        onFavoritesChange={handleFavoriteToggle}
      />
    </div>
  );
}

export default App;