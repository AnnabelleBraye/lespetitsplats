import recipesList from '../data/recipe.js';
import searchbar from '../component/search-bar.js';
import recipesUtils from './utils/recipes.js';
import multiselect from '../component/multiselect.js';
import storageUtils from './utils/storage-utils.js';
import tagFunctions from '../component/tag.js';
import testAlgo from '../test/test.js';

const searchBarElt = document.getElementById('search-bar');

const initSearchFilter = () => {
  const filter = storageUtils.getDataStorage('search-filter', '');

  searchBarElt.value = filter;
  searchbar.filterList(filter);
  const xmarkInputElt = searchBarElt.parentElement.querySelector('div > img');
  xmarkInputElt.tabIndex = 0;
  xmarkInputElt.addEventListener('click', searchbar.resetFilter);
  xmarkInputElt.addEventListener('keydown', handleKeydown);
};

/**
 * Add event listener on open or close every multiselect lists
 */
const initMultiselects = () => {
  const multiselects = document.querySelectorAll(
    '#ingredients-select, #appliances-select, #ustensils-select'
  );

  window.addEventListener('click', () => {
    const multiselects = document.querySelectorAll(
      '#ingredients-select, #appliances-select, #ustensils-select'
    );
    for (let i = 0; i < multiselects.length; i++) {
      multiselect.closeList(multiselects[i]);
    }
  });

  for (let i = 0; i < multiselects.length; i++) {
    multiselects[i].addEventListener('click', multiselect.openList, false);
    multiselects[i].tabIndex = 0;
  }
};

/**
 * Get multiselect selected tags to create tags
 */
const initTagsList = () => {
  const tags = new Map(storageUtils.getDataStorage('select-tags', []));
  for (let key of tags.keys()) {
    tagFunctions.createTagElt(key);
  }
};

/**
 * Get recipes, tags and multiselect when init
 */
const init = async () => {
  searchBarElt.addEventListener('input', searchbar.filterListEvent);
  window.addEventListener('keydown', handleKeydown, false);

  let recipes = storageUtils.getDataStorage('recipes', recipesList);
  recipes = recipesUtils.orderRecipesByName(recipes);
  // SetItem for first init
  localStorage.setItem('recipes', JSON.stringify(recipes));
  // If not first init, replace all recipes by filtered recipes
  recipes = storageUtils.getDataStorage('recipes-filtered', recipes);

  initSearchFilter();

  initTagsList();

  initMultiselects();

  document.addEventListener('DOMContentLoaded', () => {
    recipesUtils.updateDynamicContent();
    // testAlgo();
  });
};

const handleKeydown = (e) => {
  e.stopPropagation();
  const key = e.key;

  if (key === 'Escape') {
    if (!e.target.id.includes('-select')) {
      e.target.parentElement.parentElement.parentElement.focus();
    }
    multiselect.closeList(e.target);
  } else if (key === 'Enter') {
    if (e.target.id.includes('-select')) {
      multiselect.openList(e);
    } else if (e.target.id === 'input-xmark') {
      searchbar.resetFilter();
    }
  }
};

init();
