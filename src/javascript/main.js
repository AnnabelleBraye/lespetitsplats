import recipesList from '../data/recipe.js';
import filterList from '../component/search-bar.js';
import recipesUtils from './utils/recipes.js';
import openList from '../component/multiselect.js';

const initMultiselects = () => {
  const multiselects = document.querySelectorAll(
    '#ingredients-select, #appliances-select, #ustensils-select'
  );

  multiselects.forEach((select) => {
    select.addEventListener('click', openList, false);
  });
};

const init = async () => {
  const recipes = recipesList;

  const searchBarElt = document.getElementById('search-bar');
  searchBarElt.listToFilter = recipes;
  searchBarElt.addEventListener('input', filterList);

  document.addEventListener(
    'DOMContentLoaded',
    recipesUtils.updateDynamicContent(recipes)
  );

  initMultiselects();
};

init();
