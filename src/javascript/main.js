import recipesList from '../data/recipe.js';
import filterList from '../component/search-bar.js';
import generateRecipesList from './utils/recipes.js';

const init = async () => {
  const recipes = recipesList;

  const searchBarElt = document.getElementById('search-bar');
  searchBarElt.listToFilter = recipes;
  searchBarElt.addEventListener('input', filterList);

  document.addEventListener('DOMContentLoaded', generateRecipesList(recipes));
};

init();
