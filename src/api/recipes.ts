import { Recipe } from '../types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const recipeAPI = {
  searchByIngredient: async (ingredient: string): Promise<Recipe[]> => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error fetching recipes by ingredient:', error);
      return [];
    }
  },

  getRecipeDetails: async (id: string): Promise<Recipe | null> => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return null;
    }
  },

  searchByCategory: async (category: string): Promise<Recipe[]> => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return [];
    }
  },

  getRandomRecipe: async (): Promise<Recipe | null> => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching random recipe:', error);
      return null;
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories?.map((cat: any) => cat.strCategory) || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};