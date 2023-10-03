import recipesList from '../data/recipe.js';
import filterList from '../component/search-bar.js';
import recipesUtils from './utils/recipes.js';
import openList from '../component/multiselect.js';
import storageUtils from './utils/storage-utils.js';

const initMultiselects = () => {
  const multiselects = document.querySelectorAll(
    '#ingredients-select, #appliances-select, #ustensils-select'
  );

  multiselects.forEach((select) => {
    select.addEventListener('click', openList, false);
  });
};

const init = async () => {
  const recipes = storageUtils.getStorageData('recipes', recipesList);
  localStorage.setItem('recipes', JSON.stringify(recipes));

  const searchBarElt = document.getElementById('search-bar');
  searchBarElt.addEventListener('input', filterList);

  initMultiselects();

  document.addEventListener(
    'DOMContentLoaded',
    recipesUtils.updateDynamicContent(recipes)
  );
};

init();
