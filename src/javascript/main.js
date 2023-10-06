import recipesList from '../data/recipe.js';
import searchbar from '../component/search-bar.js';
import recipesUtils from './utils/recipes.js';
import multiselect from '../component/multiselect.js';
import storageUtils from './utils/storage-utils.js';
import tagFunctions from '../component/tag.js';

const searchBarElt = document.getElementById('search-bar');

const initSearchFilter = () => {
  const filter = storageUtils.getDataStorage('search-filter', '');
  searchBarElt.value = filter;
  searchbar.filterList(filter);
  const xmarkInputElt = searchBarElt.parentElement.querySelector('div > img');
  xmarkInputElt.addEventListener('click', searchbar.resetFilter);
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
    multiselects.forEach((select) => {
      multiselect.closeList(select);
    });
  });

  multiselects.forEach((select) => {
    select.addEventListener('click', multiselect.openList, false);
    select.addEventListener('keydown', handleKeydown, false);
    select.tabIndex = 0;
  });
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

  let recipes = storageUtils.getDataStorage('recipes', recipesList);
  // SetItem for first init
  localStorage.setItem('recipes', JSON.stringify(recipes));
  // If not first init, replace all recipes by filtered recipes
  recipes = storageUtils.getDataStorage('recipes-filtered', recipes);

  initSearchFilter();

  initTagsList();

  initMultiselects();

  document.addEventListener(
    'DOMContentLoaded',
    recipesUtils.updateDynamicContent()
  );
};

const handleKeydown = (e) => {
  const key = e.key;
  const select = e.target;

  if (key === 'Escape' && e.target.id.includes('-select')) {
    multiselect.closeList(select);
  } else if (key === 'Enter' && e.target.id.includes('-select')) {
    select.classList.remove('focus:outline');
    select.classList.remove('focus:outline-1');
    multiselect.openList(e);
    select.querySelector('input').focus();
  }
};

init();
