import recipesUtils from '../javascript/utils/recipes.js';
import storageUtils from '../javascript/utils/storage-utils.js';
import stringUtils from '../javascript/utils/string-utils.js';

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
      filteredList = recipesUtils.filterRecipesByAllTags(recipes, tagsList);
      const list = [];
      for (const elt of filteredList) {
        if (filterByNameDescIngredient(elt, filter)) {
          list.push(elt);
        }
      }
      filteredList = list;
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
  const filterNormalized = stringUtils.normalizeNFD(filter);
  let normalizedName = stringUtils.normalizeNFD(elt.name);
  let normalizedDesc = stringUtils.normalizeNFD(elt.description);
  return (
    normalizedName.toLowerCase().includes(filterNormalized) ||
    normalizedDesc.toLowerCase().includes(filterNormalized) ||
    elt.ingredients.some((el) => {
      let ingredient = stringUtils.normalizeNFD(el.ingredient);

      return ingredient.toLowerCase().includes(filterNormalized);
    })
  );
};

/**
 * Set recipes-filtered and search-filter in storage then update dynamic content
 * @param {*} filteredList
 * @param {*} filter
 */
const updateContent = (filteredList, filter) => {
  const filteredRecipes = recipesUtils.orderRecipesByName(filteredList);

  localStorage.setItem('recipes-filtered', JSON.stringify(filteredRecipes));
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
