import { Recipe, FavoriteRecipe, SearchHistory } from '../types';

export const parseIngredients = (recipe: Recipe): Array<{ ingredient: string; measure: string }> => {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }
  
  return ingredients;
};

export const estimateCookingTime = (instructions: string): number => {
  const text = instructions.toLowerCase();
  
  // Look for explicit time mentions
  const timeMatch = text.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/g);
  if (timeMatch) {
    let totalMinutes = 0;
    timeMatch.forEach(match => {
      const [_, num, unit] = match.match(/(\d+)\s*(minutes?|mins?|hours?|hrs?)/) || [];
      const minutes = parseInt(num);
      if (unit.startsWith('hour') || unit.startsWith('hr')) {
        totalMinutes += minutes * 60;
      } else {
        totalMinutes += minutes;
      }
    });
    return Math.max(totalMinutes, 15);
  }
  
  // Estimate based on cooking methods and complexity
  const quickKeywords = ['microwave', 'no-cook', 'instant', 'quick'];
  const mediumKeywords = ['fry', 'sauté', 'grill', 'pan'];
  const slowKeywords = ['bake', 'roast', 'slow cook', 'marinate', 'braise'];
  
  if (quickKeywords.some(keyword => text.includes(keyword))) {
    return 15;
  } else if (slowKeywords.some(keyword => text.includes(keyword))) {
    return 60;
  } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
    return 30;
  }
  
  // Default estimation based on instruction length
  const wordCount = instructions.split(' ').length;
  return Math.max(Math.min(wordCount * 0.5, 90), 15);
};

export const getDifficultyLevel = (recipe: Recipe): 'Easy' | 'Medium' | 'Hard' => {
  const ingredients = parseIngredients(recipe);
  const instructions = recipe.strInstructions?.toLowerCase() || '';
  
  const complexKeywords = ['marinate', 'reduce', 'braise', 'confit', 'emulsify', 'tempering'];
  const easyKeywords = ['mix', 'combine', 'add', 'heat', 'microwave', 'instant'];
  
  if (ingredients.length > 15 || complexKeywords.some(keyword => instructions.includes(keyword))) {
    return 'Hard';
  } else if (ingredients.length > 8 || instructions.split('.').length > 8) {
    return 'Medium';
  } else {
    return 'Easy';
  }
};

export const saveToFavorites = (recipe: Recipe): void => {
  const favorites = getFavorites();
  const favorite: FavoriteRecipe = {
    id: recipe.idMeal,
    name: recipe.strMeal,
    image: recipe.strMealThumb,
    category: recipe.strCategory,
    savedAt: Date.now()
  };
  
  const updatedFavorites = [favorite, ...favorites.filter(fav => fav.id !== recipe.idMeal)];
  localStorage.setItem('recipe-favorites', JSON.stringify(updatedFavorites));
};

export const removeFromFavorites = (recipeId: string): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
  localStorage.setItem('recipe-favorites', JSON.stringify(updatedFavorites));
};

export const getFavorites = (): FavoriteRecipe[] => {
  try {
    const stored = localStorage.getItem('recipe-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const isFavorite = (recipeId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === recipeId);
};

export const saveSearchHistory = (ingredient: string): void => {
  const history = getSearchHistory();
  const newEntry: SearchHistory = {
    ingredient,
    timestamp: Date.now()
  };
  
  const updatedHistory = [newEntry, ...history.filter(h => h.ingredient !== ingredient)].slice(0, 10);
  localStorage.setItem('search-history', JSON.stringify(updatedHistory));
};

export const getSearchHistory = (): SearchHistory[] => {
  try {
    const stored = localStorage.getItem('search-history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};