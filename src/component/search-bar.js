import recipesUtils from '../javascript/utils/recipes.js';
import storageUtils from '../javascript/utils/storage-utils.js';

/**
 * Starts filter at 3 caracters and update recipes-filtered list and search-filter in storage
 * Then finally update dynamic content
 */
const filterList = (filter) => {
  const recipes = storageUtils.getDataStorage('recipes', []);
  let listToFilter = storageUtils.getDataStorage('recipes-filtered', recipes);
  const oldFilter = storageUtils.getDataStorage('search-filter', '');
  let filteredList = [];

  const tagsList = new Map(storageUtils.getDataStorage('select-tags', []));
  if (filter) {
    if (filter.length >= 3) {
      if (oldFilter.length < filter.length) {
        filteredList = listToFilter.filter((elt) =>
          filterByNameDescIngredient(elt, filter)
        );
      } else {
        filteredList = recipesUtils.filterRecipesByAllTags(recipes, tagsList);

        filteredList = filteredList.filter((elt) =>
          filterByNameDescIngredient(elt, filter)
        );
      }
    } else if (oldFilter.length < 3 && oldFilter.length > filter.length) {
      filteredList = listToFilter;
    } else {
      filteredList = recipesUtils.filterRecipesByAllTags(recipes, tagsList);
    }

    updateContent(filteredList, filter);
  } else if (oldFilter.length >= 3 && !filter) {
    filteredList = recipesUtils.filterRecipesByAllTags(recipes, tagsList);

    updateContent(filteredList, filter);
  }
};

/**
 * Event on enter letter on search bar
 * @param {*} e
 */
const filterListEvent = (e) => {
  const filter = e.target.value.toLowerCase();

  filterList(filter);
};

/**
 * Filter list element with the filter in input by name, description and ingredient
 * @param {*} elt
 * @param {*} filter
 * @returns
 */
const filterByNameDescIngredient = (elt, filter) => {
  return (
    elt.name.toLowerCase().includes(filter) ||
    elt.description.toLowerCase().includes(filter) ||
    elt.ingredients.some((el) => el.ingredient.toLowerCase().includes(filter))
  );
};

/**
 * Set recipes-filtered and search-filter in storage then update dynamic content
 * @param {*} filteredList
 * @param {*} filter
 */
const updateContent = (filteredList, filter) => {
  localStorage.setItem('recipes-filtered', JSON.stringify(filteredList));
  localStorage.setItem(
    'search-filter',
    JSON.stringify(filter.length < 3 ? '' : filter)
  );
  recipesUtils.updateDynamicContent();
};

const resetFilter = () => {
  const searchBarElt = document.getElementById('search-bar');
  searchBarElt.value = '';
  filterList('');
};

export default {
  filterList,
  filterListEvent,
  filterByNameDescIngredient,
  resetFilter,
};
