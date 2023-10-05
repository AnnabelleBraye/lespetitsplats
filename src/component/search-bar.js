import recipesUtils from '../javascript/utils/recipes.js';
import storageUtils from '../javascript/utils/storage-utils.js';

const searchBarElt = document.getElementById('search-bar');

/**
 * Starts filter at 3 caracters and update recipes-filtered list and search-filter in storage
 * Then finally update dynamic content
 */
const filterList = (filter) => {
  const listToFilter = JSON.parse(localStorage.getItem('recipes'));
  let filteredList = [];

  if (filter.length >= 3) {
    filteredList = listToFilter.filter((elt) =>
      filterByNameDescIngredient(elt, filter)
    );
  } else {
    filteredList = listToFilter;
  }

  localStorage.setItem('recipes-filtered', JSON.stringify(filteredList));
  localStorage.setItem('search-filter', JSON.stringify(filter));
  recipesUtils.updateDynamicContent();
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

export default { filterList, filterListEvent, filterByNameDescIngredient };
